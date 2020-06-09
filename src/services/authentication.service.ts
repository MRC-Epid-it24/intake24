import duo from '@duosecurity/duo_web';
import config from '@/config/security';
import User from '@/db/models/system/user';
import UserPassword from '@/db/models/system/user-password';
import UserSurveyAlias from '@/db/models/system/user-survey-alias';
import UnauthorizedError from '@/http/errors/unauthorized.error';
import {btoa} from '@/util';
import jwtSvc, {Subject, TokenPayload, Tokens} from './jwt.service';
import logger from './logger';
import {supportedAlgorithms} from "@/util/passwords";

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
    const user = await User.scope(['password']).findOne({where: {email}});

    console.log(user);

    if (config.mfa.enabled && user?.multiFactorAuthentication) {
      return this.signMfaRequest(email);
    }

    const subject: Subject = {providerID: 'email', providerKey: email};

    return this.login(user, password, subject);
  },

  async signMfaRequest(email: string): Promise<MfaRequest> {
    const {provider} = config.mfa;
    const {ikey, skey, akey, host} = config.mfa.providers[provider];

    const request = duo.sign_request(ikey, skey, akey, email);

    return {mfa: {request, host}};
  },

  /**
   * Verify multi-factor authentication response
   *
   * @param {string} sigResponse
   * @returns {Promise<Tokens>}
   */
  async verifyMfa(sigResponse: string): Promise<Tokens> {
    const {provider} = config.mfa;
    const {ikey, skey, akey} = config.mfa.providers[provider];

    const email = duo.verify_response(ikey, skey, akey, sigResponse);
    if (!email) throw new UnauthorizedError();

    const user = await User.scope('roles').findOne({where: {email}});
    if (!user) throw new UnauthorizedError();

    const payload: TokenPayload = {userId: user.id, roles: user.roleList()};
    const subject: Subject = {providerID: 'email', providerKey: email};

    return jwtSvc.signTokens(payload, {subject: btoa(subject)});
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
    const user = await User.scope(['legacyPassword', 'roles']).findOne({
      include: [
        {
          model: UserSurveyAlias,
          where: {userName, surveyId},
        },
        {model: UserPassword},
      ],
    });

    const subject: Subject = {providerID: 'surveyAlias', providerKey: `${surveyId}#${userName}`};

    return this.login(user, password, subject);
  },

  /**
   * URL-embeded toekn login to respondent applications
   *
   * @param {string} token
   * @returns {Promise<Tokens>}
   */
  async tokenLogin(token: string): Promise<Tokens> {
    const user = await User.scope('roles').findOne({
      include: [
        {
          model: UserSurveyAlias,
          where: {urlAuthToken: token},
        },
        {model: UserPassword},
      ],
    });

    const subject: Subject = {providerID: 'URLToken', providerKey: token};

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
      throw new UnauthorizedError(`Provided credentials doesn't match with our records.`);

    const payload: TokenPayload = {userId: user.id, roles: user.roleList()};

    return jwtSvc.signTokens(payload, {subject: btoa(subject)});
  },

  /**
   * Login helper to verify user's password
   * 1) Check & verify new bcrypt password
   * 2) Fallback to legacy password (TODO: to implement)
   *
   * @param {string} password
   * @param {User} user
   * @returns {Promise<boolean>}
   */
  async verifyPassword(password: string, user: User): Promise<boolean> {
    if (user.password) {
      const passwordHasher = user.password.passwordHasher;
      const algorithm = supportedAlgorithms.find(a => a.id == passwordHasher);

      if (algorithm) {
        return algorithm.verify(password, {
          salt: user.password.passwordSalt,
          hash: user.password.passwordHash
        });
      } else {
       return Promise.reject(`Password algorithm ${user.password.passwordHasher} not supported.`)
      }
    } else {
      return Promise.reject('Password login not enabled for this user.')
    }
  },

  /**
   * Issue new access token using refresh token
   *
   * @param {string} token
   * @returns {Promise<string>}
   */
  async refresh(token: string): Promise<string> {
    try {
      const {userId, sub: subject} = await jwtSvc.verifyRefreshToken(token);
      const user = await User.scope('roles').findByPk(userId);
      if (!user) throw new UnauthorizedError();

      const roles = user.roleList();
      return await jwtSvc.signAccessToken({userId, roles}, {subject});
    } catch (err) {
      const {message, name, stack} = err;
      logger.error(stack ?? `${name}: ${message}`);
      throw new UnauthorizedError();
    }
  },
};
