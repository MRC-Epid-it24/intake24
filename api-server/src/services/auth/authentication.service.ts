import duo from '@duosecurity/duo_web';
import { Permission, User, UserPassword, UserSurveyAlias } from '@/db/models/system';
import { UnauthorizedError } from '@/http/errors';
import { btoa } from '@/util';
import { supportedAlgorithms } from '@/util/passwords';
import type { IoC } from '@/ioc';
import { SignPayload, Subject, Tokens } from './jwt.service';

export type MfaRequest = { mfa: { request: string; host: string } };

export interface AuthenticationService {
  issueTokens: (userId: number, subject: Subject | string) => Promise<Tokens>;
  verifyPassword: (password: string, user: User) => Promise<boolean>;
  signMfaRequest: (email: string) => Promise<MfaRequest>;
  login: (user: User | null, password: string, subject: Subject) => Promise<Tokens>;
  emailLogin: (email: string, password: string) => Promise<Tokens | MfaRequest>;
  aliasLogin: (userName: string, password: string, surveyId: string) => Promise<Tokens>;
  tokenLogin: (token: string) => Promise<Tokens>;
  verifyMfa: (sigResponse: string) => Promise<Tokens>;
  refresh: (token: string) => Promise<Tokens>;
}

export default ({ config, logger, jwtService, jwtRotationService }: IoC): AuthenticationService => {
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
    if (user.password) {
      const { passwordHasher } = user.password;
      const algorithm = supportedAlgorithms.find((a) => a.id === passwordHasher);

      if (algorithm) {
        return algorithm.verify(password, {
          salt: user.password.passwordSalt,
          hash: user.password.passwordHash,
        });
      }
      return Promise.reject(
        new Error(`Password algorithm '${user.password.passwordHasher}' not supported.`)
      );
    }
    return Promise.reject(new Error('Password login not enabled for this user.'));
  };

  /**
   * Sign MFA request
   *
   * @param {string} email
   * @returns {Promise<MfaRequest>}
   */
  const signMfaRequest = async (email: string): Promise<MfaRequest> => {
    const { provider } = config.security.mfa;
    const { ikey, skey, akey, host } = config.security.mfa.providers[provider];

    const request = duo.sign_request(ikey, skey, akey, email);

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
  const login = async (user: User | null, password: string, subject: Subject): Promise<Tokens> => {
    if (!user || (subject.providerID !== 'URLToken' && !(await verifyPassword(password, user))))
      throw new UnauthorizedError(`Provided credentials do not match our records.`);

    return issueTokens(user.id, subject);
  };

  /**
   * Email login to Administration application
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Tokens>}
   */
  const emailLogin = async (email: string, password: string): Promise<Tokens | MfaRequest> => {
    const user = await User.scope('password').findOne({ where: { email } });

    if (config.security.mfa.enabled && user?.multiFactorAuthentication) {
      return signMfaRequest(email);
    }

    const subject: Subject = { providerID: 'email', providerKey: email };

    return login(user, password, subject);
  };

  /**
   * Survey alias login to respondent applications
   *
   * @param {string} userName
   * @param {string} password
   * @param {string} surveyId
   * @returns {Promise<Tokens>}
   */
  const aliasLogin = async (
    userName: string,
    password: string,
    surveyId: string
  ): Promise<Tokens> => {
    const user = await User.scope('password').findOne({
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

    const subject: Subject = { providerID: 'surveyAlias', providerKey: `${surveyId}#${userName}` };

    return login(user, password, subject);
  };

  /**
   * URL-embedded token login to respondent applications
   *
   * @param {string} token
   * @returns {Promise<Tokens>}
   */
  const tokenLogin = async (token: string): Promise<Tokens> => {
    const user = await User.scope('roles').findOne({
      include: [
        {
          model: UserSurveyAlias,
          where: { urlAuthToken: token },
        },
        { model: UserPassword },
      ],
    });

    const subject: Subject = { providerID: 'URLToken', providerKey: token };

    return login(user, '', subject);
  };

  /**
   * Verify multi-factor authentication response
   *
   * @param {string} sigResponse
   * @returns {Promise<Tokens>}
   */
  const verifyMfa = async (sigResponse: string): Promise<Tokens> => {
    const { provider } = config.security.mfa;
    const { ikey, skey, akey } = config.security.mfa.providers[provider];

    const email = duo.verify_response(ikey, skey, akey, sigResponse);
    if (!email) throw new UnauthorizedError();

    const user = await User.findOne({ where: { email } });
    if (!user) throw new UnauthorizedError();

    const subject: Subject = { providerID: 'email', providerKey: email };

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
