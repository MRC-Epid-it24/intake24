import duo from '@duosecurity/duo_web';
import config from '@/config/security';
import { Permission, User, UserPassword, UserSurveyAlias } from '@/db/models/system';
import { UnauthorizedError } from '@/http/errors';
import { btoa } from '@/util';
import { supportedAlgorithms } from '@/util/passwords';
import logger from '@/services/logger';
import jwtSvc, { SignPayload, Subject, Tokens } from './jwt.service';
import jwtRotationSvc from './jwt-rotation.service';

export type MfaRequest = { mfa: { request: string; host: string } };

export default {
  /**
   * Email login to Administration application
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Tokens>}
   */
  async emailLogin(email: string, password: string): Promise<Tokens | MfaRequest> {
    const user = await User.scope('password').findOne({ where: { email } });

    if (config.mfa.enabled && user?.multiFactorAuthentication) {
      return this.signMfaRequest(email);
    }

    const subject: Subject = { providerID: 'email', providerKey: email };

    return this.login(user, password, subject);
  },

  /**
   * Survey alias login to respondent applications
   *
   * @param {string} userName
   * @param {string} password
   * @param {string} surveyId
   * @returns {Promise<Tokens>}
   */
  async aliasLogin(userName: string, password: string, surveyId: string): Promise<Tokens> {
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

    return this.login(user, password, subject);
  },

  /**
   * URL-embedded token login to respondent applications
   *
   * @param {string} token
   * @returns {Promise<Tokens>}
   */
  async tokenLogin(token: string): Promise<Tokens> {
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

    return this.login(user, '', subject);
  },

  /**
   * Login helper with common login logic
   *
   * @param {(User | null)} user
   * @param {string} password
   * @param {Subject} subject
   * @returns {Promise<Tokens>}
   */
  async login(user: User | null, password: string, subject: Subject): Promise<Tokens> {
    if (
      !user ||
      (subject.providerID !== 'URLToken' && !(await this.verifyPassword(password, user)))
    )
      throw new UnauthorizedError(`Provided credentials do not match our records.`);

    return this.issueTokens(user.id, subject);
  },

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
  async verifyPassword(password: string, user: User): Promise<boolean> {
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
  },

  /**
   * Sign MFA request
   *
   * @param {string} email
   * @returns {Promise<MfaRequest>}
   */
  async signMfaRequest(email: string): Promise<MfaRequest> {
    const { provider } = config.mfa;
    const { ikey, skey, akey, host } = config.mfa.providers[provider];

    const request = duo.sign_request(ikey, skey, akey, email);

    return { mfa: { request, host } };
  },

  /**
   * Verify multi-factor authentication response
   *
   * @param {string} sigResponse
   * @returns {Promise<Tokens>}
   */
  async verifyMfa(sigResponse: string): Promise<Tokens> {
    const { provider } = config.mfa;
    const { ikey, skey, akey } = config.mfa.providers[provider];

    const email = duo.verify_response(ikey, skey, akey, sigResponse);
    if (!email) throw new UnauthorizedError();

    const user = await User.findOne({ where: { email } });
    if (!user) throw new UnauthorizedError();

    const subject: Subject = { providerID: 'email', providerKey: email };

    return this.issueTokens(user.id, subject);
  },

  /**
   * Issue JWT tokens and log for rotation
   *
   * @param {User} user
   * @returns {Promise<Tokens>}
   */
  async issueTokens(userId: number, subject: Subject | string): Promise<Tokens> {
    const payload: SignPayload = { userId };

    const { accessToken, refreshToken } = await jwtSvc.signTokens(payload, {
      subject: typeof subject === 'string' ? subject : btoa(subject),
    });
    await jwtRotationSvc.save(userId, refreshToken);

    return { accessToken, refreshToken };
  },

  /**
   * Issue new access token using refresh token
   *
   * @param {string} token
   * @returns {Promise<Tokens>}
   */
  async refresh(token: string): Promise<Tokens> {
    try {
      const { userId, sub: subject } = await jwtSvc.verifyRefreshToken(token);

      const user = await User.findByPk(userId);
      if (!user) throw new UnauthorizedError();

      const valid = await jwtRotationSvc.verifyAndRevoke(token);
      if (!valid) throw new UnauthorizedError();

      return await this.issueTokens(userId, subject);
    } catch (err) {
      const { message, name, stack } = err;
      logger.error(stack ?? `${name}: ${message}`);
      throw new UnauthorizedError();
    }
  },
};
