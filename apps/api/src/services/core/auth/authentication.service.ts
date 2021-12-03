import { Request } from 'express';
import { Op } from 'sequelize';
import { Permission, User, UserPassword, UserSurveyAlias } from '@api/db/models/system';
import { UnauthorizedError } from '@api/http/errors';
import { supportedAlgorithms } from '@api/util/passwords';
import type { IoC } from '@api/ioc';
import type { Subject, Tokens } from '.';
import type { MFARequest } from './mfa';

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

export type LoginCredentials = {
  user: User | null;
  password: string;
  subject: Subject;
};

export type LoginMeta = {
  req: Request;
};

export interface SignInAttempt extends Subject {
  userId?: string;
  remoteAddress?: string;
  userAgent?: string;
  successful: boolean;
  message?: string;
}

const authenticationService = ({
  jwtRotationService,
  jwtService,
  logger,
  mfaProvider,
  securityConfig,
  signInService,
}: Pick<
  IoC,
  | 'jwtRotationService'
  | 'jwtService'
  | 'logger'
  | 'mfaProvider'
  | 'securityConfig'
  | 'signInService'
>) => {
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
   * Login helper with common login logic
   *
   * @param {LoginCredentials} credentials
   * @param {LoginMeta} meta
   * @returns {Promise<Tokens>}
   */
  const login = async (credentials: LoginCredentials, { req }: LoginMeta): Promise<Tokens> => {
    const { user, password, subject } = credentials;
    const {
      ip: remoteAddress,
      headers: { 'user-agent': userAgent },
    } = req;

    const signInLog: SignInAttempt = {
      ...subject,
      userId: user?.id,
      remoteAddress,
      userAgent,
      successful: false,
    };

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

    return jwtService.issueTokens(user.id, subject);
  };

  /**
   * Email login to Administration application
   *
   * @param {EmailLoginCredentials} credentials
   * @param {LoginMeta} meta
   * @returns {(Promise<Tokens | MFARequest>)}
   */
  const emailLogin = async (
    credentials: EmailLoginCredentials,
    meta: LoginMeta
  ): Promise<Tokens | MFARequest> => {
    const { email, password } = credentials;

    const op = User.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;
    const user = await User.findOne({
      where: { email: { [op]: email } },
      include: [{ model: UserPassword, required: true }],
    });

    if (securityConfig.mfa.enabled && user?.multiFactorAuthentication)
      return mfaProvider.request({ email, userId: user.id }, meta);

    const subject: Subject = { provider: 'email', providerKey: email };

    return login({ user, password, subject }, meta);
  };

  /**
   * Survey alias login to respondent applications
   *
   * @param {AliasLoginCredentials} credentials
   * @param {LoginMeta} meta
   * @returns {Promise<Tokens>}
   */
  const aliasLogin = async (
    credentials: AliasLoginCredentials,
    meta: LoginMeta
  ): Promise<Tokens> => {
    const { userName, password, surveyId } = credentials;

    const user = await User.findOne({
      include: [
        { model: Permission, where: { name: `${surveyId}/respondent` } },
        { model: UserPassword },
        { model: UserSurveyAlias, where: { userName, surveyId } },
      ],
    });

    const subject: Subject = { provider: 'surveyAlias', providerKey: `${surveyId}#${userName}` };

    return login({ user, password, subject }, meta);
  };

  /**
   * URL-embedded token login to respondent applications
   *
   * @param {TokenLoginCredentials} credentials
   * @param {LoginMeta} meta
   * @returns {Promise<Tokens>}
   */
  const tokenLogin = async ({ token }: TokenLoginCredentials, meta: LoginMeta): Promise<Tokens> => {
    const user = await User.findOne({
      include: [
        { model: UserSurveyAlias, where: { urlAuthToken: token } },
        { model: UserPassword },
      ],
    });

    const subject: Subject = { provider: 'URLToken', providerKey: token };

    return login({ user, password: '', subject }, meta);
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

      return await jwtService.issueTokens(userId, subject);
    } catch (err: any) {
      const { message, name, stack } = err;
      logger.error(stack ?? `${name}: ${message}`);
      throw new UnauthorizedError();
    }
  };

  return {
    verifyPassword,
    login,
    emailLogin,
    aliasLogin,
    tokenLogin,
    refresh,
  };
};

export default authenticationService;

export type AuthenticationService = ReturnType<typeof authenticationService>;
