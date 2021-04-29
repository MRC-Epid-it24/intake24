import { Op } from 'sequelize';
import duo from '@duosecurity/duo_web';
import { Permission, User, UserPassword, UserSurveyAlias } from '@/db/models/system';
import { UnauthorizedError } from '@/http/errors';
import { btoa } from '@/util';
import { supportedAlgorithms } from '@/util/passwords';
import type { IoC } from '@/ioc';
import type { SignPayload, Subject, Tokens } from '.';

export type EmailLoginCredentials = {
  email: string;
  password: string;
};

export type AliasLoginCredentials = {
  userName: string;
  password: string;
  surveyId: string;
};

export type TokenLoginCredentials = {
  token: string;
};

export type MFALoginCredentials = {
  email: string;
  userId: number;
};

export type MFAVerifyCredentials = {
  sigResponse: string;
};

export type LoginCredentials = {
  user: User | null;
  password: string;
  subject: Subject;
};

export type LoginMeta = {
  remoteAddress?: string;
  userAgent?: string;
};

export interface SignInAttempt extends LoginMeta, Subject {
  userId?: number;
  successful: boolean;
  message?: string;
}

export type MfaRequest = { mfa: { request: string; host: string } };

export interface AuthenticationService {
  issueTokens: (userId: number, subject: Subject | string) => Promise<Tokens>;
  verifyPassword: (password: string, user: User) => Promise<boolean>;
  signMfaRequest: (credentials: MFALoginCredentials, meta: LoginMeta) => Promise<MfaRequest>;
  login: (credentials: LoginCredentials, meta: LoginMeta) => Promise<Tokens>;
  emailLogin: (credentials: EmailLoginCredentials, meta: LoginMeta) => Promise<Tokens | MfaRequest>;
  aliasLogin: (credentials: AliasLoginCredentials, meta: LoginMeta) => Promise<Tokens>;
  tokenLogin: (credentials: TokenLoginCredentials, meta: LoginMeta) => Promise<Tokens>;
  verifyMfa: (credentials: MFAVerifyCredentials, meta: LoginMeta) => Promise<Tokens>;
  refresh: (token: string) => Promise<Tokens>;
}

export default ({
  config,
  logger,
  jwtService,
  jwtRotationService,
  signInService,
}: Pick<
  IoC,
  'config' | 'logger' | 'jwtService' | 'jwtRotationService' | 'signInService'
>): AuthenticationService => {
  const { mfa: mfaConfig } = config.security;

  /**
   * Issue JWT tokens and log for rotation
   *
   * @param {User} user
   * @returns {Promise<Tokens>}
   */
  const issueTokens = async (userId: number, subject: Subject | string): Promise<Tokens> => {
    const payload: SignPayload = { userId };

    const { accessToken, refreshToken } = await jwtService.signTokens(payload, {
      subject: typeof subject === 'string' ? subject : btoa(subject),
    });
    await jwtRotationService.save(userId, refreshToken);

    return { accessToken, refreshToken };
  };

  /**
   * Login helper to verify user's password
   *
   * Tries to find the password hashing algorithm from user_passwords.passwordHasher column. If a
   * supported algorithm is found, computes and compares the supplied password's hash; raises an
   * error otherwise.
   *
   * @param {string} password
   * @param {User} user
   * @returns {Promise<boolean>}
   */
  const verifyPassword = async (password: string, user: User): Promise<boolean> => {
    const { password: dbPassword } = user;
    if (!dbPassword) throw new Error('Password login not enabled for this user.');

    const { passwordHasher, passwordSalt, passwordHash } = dbPassword;

    const algorithm = supportedAlgorithms.find((a) => a.id === passwordHasher);
    if (!algorithm) throw new Error(`Password algorithm '${passwordHasher}' not supported.`);

    return algorithm.verify(password, { salt: passwordSalt, hash: passwordHash });
  };

  /**
   * Sign multi-factor authentication request
   *
   * @param {MFALoginCredentials} credentials
   * @returns {Promise<MfaRequest>}
   */
  const signMfaRequest = async (
    credentials: MFALoginCredentials,
    meta: LoginMeta
  ): Promise<MfaRequest> => {
    const { provider } = mfaConfig;
    const { ikey, skey, akey, host } = mfaConfig.providers[provider];
    const { email, userId } = credentials;

    const request = duo.sign_request(ikey, skey, akey, email);

    await signInService.log({
      ...meta,
      provider: 'email',
      providerKey: email,
      userId,
      successful: true,
    });

    return { mfa: { request, host } };
  };

  /**
   * Login helper with common login logic
   *
   * @param {(User | null)} user
   * @param {string} password
   * @param {Subject} subject
   * @returns {Promise<Tokens>}
   */
  const login = async (credentials: LoginCredentials, meta: LoginMeta): Promise<Tokens> => {
    const { user, password, subject } = credentials;

    const signInLog: SignInAttempt = { ...meta, ...subject, userId: user?.id, successful: false };

    if (!user) {
      await signInService.log({
        ...signInLog,
        message: 'Credentials not found in database.',
      });

      throw new UnauthorizedError(`Provided credentials do not match our records.`);
    }

    if (subject.provider !== 'URLToken' && !(await verifyPassword(password, user))) {
      await signInService.log({ ...signInLog, message: 'Credentials do not match.' });

      throw new UnauthorizedError(`Provided credentials do not match our records.`);
    }

    await signInService.log({ ...signInLog, successful: true });

    return issueTokens(user.id, subject);
  };

  /**
   * Email login to Administration application
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Tokens>}
   */
  const emailLogin = async (
    credentials: EmailLoginCredentials,
    meta: LoginMeta
  ): Promise<Tokens | MfaRequest> => {
    const { email, password } = credentials;

    const op = User.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;
    const user = await User.findOne({
      where: { email: { [op]: email } },
      include: [{ model: UserPassword, required: true }],
    });

    if (config.security.mfa.enabled && user?.multiFactorAuthentication) {
      return signMfaRequest({ email, userId: user.id }, meta);
    }

    const subject: Subject = { provider: 'email', providerKey: email };

    return login({ user, password, subject }, meta);
  };

  /**
   * Survey alias login to respondent applications
   *
   * @param {AliasLoginCredentials} credentials
   * @returns {Promise<Tokens>}
   */
  const aliasLogin = async (
    credentials: AliasLoginCredentials,
    meta: LoginMeta
  ): Promise<Tokens> => {
    const { userName, password, surveyId } = credentials;

    const user = await User.findOne({
      include: [
        {
          model: Permission,
          where: { name: `${surveyId}/respondent` },
        },
        { model: UserPassword },
        {
          model: UserSurveyAlias,
          where: { userName, surveyId },
        },
      ],
    });

    const subject: Subject = { provider: 'surveyAlias', providerKey: `${surveyId}#${userName}` };

    return login({ user, password, subject }, meta);
  };

  /**
   * URL-embedded token login to respondent applications
   *
   * @param {TokenLoginCredentials} credentials
   * @returns {Promise<Tokens>}
   */
  const tokenLogin = async ({ token }: TokenLoginCredentials, meta: LoginMeta): Promise<Tokens> => {
    const user = await User.findOne({
      include: [
        {
          model: UserSurveyAlias,
          where: { urlAuthToken: token },
        },
        { model: UserPassword },
      ],
    });

    const subject: Subject = { provider: 'URLToken', providerKey: token };

    return login({ user, password: '', subject }, meta);
  };

  /**
   * Verify multi-factor authentication response
   *
   * @param {MFAVerifyCredentials} credentials
   * @param {LoginMeta} meta
   * @returns {Promise<Tokens>}
   */
  const verifyMfa = async (
    { sigResponse }: MFAVerifyCredentials,
    meta: LoginMeta
  ): Promise<Tokens> => {
    const { provider } = mfaConfig;
    const { ikey, skey, akey } = mfaConfig.providers[provider];

    const signInAttempt: SignInAttempt = {
      ...meta,
      provider,
      providerKey: sigResponse,
      successful: false,
    };

    const email = duo.verify_response(ikey, skey, akey, sigResponse);
    if (!email) {
      await signInService.log(signInAttempt);
      throw new UnauthorizedError();
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await signInService.log({
        ...signInAttempt,
        providerKey: email,
        message: 'Credentials not found in database.',
      });
      throw new UnauthorizedError();
    }

    signInService.log({ ...signInAttempt, providerKey: email, userId: user.id, successful: true });

    const subject: Subject = { provider: 'email', providerKey: email };

    return issueTokens(user.id, subject);
  };

  /**
   * Issue new access token using refresh token
   *
   * @param {string} token
   * @returns {Promise<Tokens>}
   */
  const refresh = async (token: string): Promise<Tokens> => {
    try {
      const { userId, sub: subject } = await jwtService.verifyRefreshToken(token);

      const user = await User.findByPk(userId);
      if (!user) throw new UnauthorizedError();

      const valid = await jwtRotationService.verifyAndRevoke(token);
      if (!valid) throw new UnauthorizedError();

      return await issueTokens(userId, subject);
    } catch (err) {
      const { message, name, stack } = err;
      logger.error(stack ?? `${name}: ${message}`);
      throw new UnauthorizedError();
    }
  };

  return {
    issueTokens,
    verifyPassword,
    signMfaRequest,
    login,
    emailLogin,
    aliasLogin,
    tokenLogin,
    verifyMfa,
    refresh,
  };
};
