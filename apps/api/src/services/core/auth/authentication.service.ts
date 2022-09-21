import type { Request } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { Subject } from '@intake24/common/security';
import type { FrontEnd } from '@intake24/common/types';
import type {
  AliasLoginRequest,
  EmailLoginRequest,
  TokenLoginRequest,
} from '@intake24/common/types/http';
import type { UserPassword } from '@intake24/db';
import { UnauthorizedError } from '@intake24/api/http/errors';
import { surveyRespondent } from '@intake24/common/security';
import { supportedAlgorithms } from '@intake24/common-backend/util/passwords';
import { Op, Survey, User } from '@intake24/db';

import type { Tokens } from '.';
import type { MFARequest } from './mfa';

export type LoginCredentials = {
  user: User | null;
  password: string;
  subject: Subject;
  frontEnd: FrontEnd;
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
  logger: globalLogger,
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
  const logger = globalLogger.child({ service: 'AuthenticationService' });

  /**
   * Login helper to verify user's password
   *
   * Tries to find the password hashing algorithm from user_passwords.passwordHasher column. If a
   * supported algorithm is found, computes and compares the supplied password's hash; raises an
   * error otherwise.
   *
   * @param {string} password
   * @param {UserPassword} [userPassword]
   * @returns {Promise<boolean>}
   */
  const verifyPassword = async (
    password: string,
    userPassword?: UserPassword
  ): Promise<boolean> => {
    if (!userPassword) throw new Error('Password login not enabled for this user.');

    const { passwordHasher, passwordSalt, passwordHash } = userPassword;

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
  const processLogin = async (
    credentials: LoginCredentials,
    { req }: LoginMeta
  ): Promise<Tokens> => {
    const { user, password, subject, frontEnd } = credentials;
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

      throw new UnauthorizedError('Provided credentials do not match our records.');
    }

    if (user.isDisabled()) {
      await signInService.log({
        ...signInLog,
        message: 'Account is disabled.',
      });

      throw new UnauthorizedError('Account is disabled.');
    }

    if (subject.provider !== 'URLToken' && !(await verifyPassword(password, user.password))) {
      await signInService.log({ ...signInLog, message: 'Credentials do not match.' });

      throw new UnauthorizedError(`Provided credentials do not match our records.`);
    }

    await signInService.log({ ...signInLog, successful: true });

    return jwtService.issueTokens(user.id, subject, frontEnd);
  };

  /**
   * Email login to admin application
   *
   * @param {EmailLoginRequest} credentials
   * @param {LoginMeta} meta
   * @returns {(Promise<Tokens | MFARequest>)}
   */
  const adminLogin = async (
    credentials: EmailLoginRequest,
    meta: LoginMeta
  ): Promise<Tokens | MFARequest> => {
    const { email, password } = credentials;

    const op = User.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;
    const user = await User.findOne({
      where: { email: { [op]: email } },
      include: [{ association: 'password', required: true }],
    });

    if (securityConfig.mfa.enabled && user?.multiFactorAuthentication)
      return mfaProvider.request({ email, userId: user.id }, meta);

    const subject: Subject = { provider: 'email', providerKey: email };

    return processLogin({ user, password, subject, frontEnd: 'admin' }, meta);
  };

  /**
   * Email login to respondent application
   *
   * @param {EmailLoginRequest} credentials
   * @param {LoginMeta} meta
   * @returns {Promise<Tokens>}
   */
  const emailLogin = async (credentials: EmailLoginRequest, meta: LoginMeta): Promise<Tokens> => {
    const { email, password } = credentials;

    const op = User.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;
    const user = await User.findOne({
      where: { email: { [op]: email } },
      include: [{ association: 'password', required: true }],
    });

    const subject: Subject = { provider: 'email', providerKey: email };

    return processLogin({ user, password, subject, frontEnd: 'survey' }, meta);
  };

  /**
   * Survey alias login to respondent application
   *
   * @param {AliasLoginRequest} credentials
   * @param {LoginMeta} meta
   * @returns {Promise<Tokens>}
   */
  const aliasLogin = async (credentials: AliasLoginRequest, meta: LoginMeta): Promise<Tokens> => {
    const { username, password, survey: slug } = credentials;

    const survey = await Survey.findOne({ where: { slug } });
    if (!survey) throw new UnauthorizedError('Invalid survey for provided credentials.');

    const user = await User.findOne({
      include: [
        { association: 'permissions', where: { name: surveyRespondent(slug) } },
        { association: 'password' },
        { association: 'aliases', where: { username, surveyId: survey.id } },
      ],
    });

    const subject: Subject = { provider: 'surveyAlias', providerKey: `${slug}#${username}` };

    return processLogin({ user, password, subject, frontEnd: 'survey' }, meta);
  };

  /**
   * URL-embedded token login to respondent application
   *
   * @param {TokenLoginRequest} credentials
   * @param {LoginMeta} meta
   * @returns {Promise<Tokens>}
   */
  const tokenLogin = async ({ token }: TokenLoginRequest, meta: LoginMeta): Promise<Tokens> => {
    const user = await User.findOne({
      include: [
        { association: 'aliases', where: { urlAuthToken: token } },
        { association: 'password' },
      ],
    });

    const subject: Subject = { provider: 'URLToken', providerKey: token };

    return processLogin({ user, password: '', subject, frontEnd: 'survey' }, meta);
  };

  /**
   * Issue new access token using refresh token
   *
   * @param {string} token
   * @param {FrontEnd} frontEnd
   * @returns {Promise<Tokens>}
   */
  const refresh = async (token: string, frontEnd: FrontEnd): Promise<Tokens> => {
    try {
      const { userId, sub: subject } = await jwtService.verifyRefreshToken(token, frontEnd);

      const user = await User.findByPk(userId);
      if (!user) throw new UnauthorizedError();

      const valid = await jwtRotationService.verifyAndRevoke(token);
      if (!valid) throw new UnauthorizedError();

      return await jwtService.issueTokens(userId, subject, frontEnd);
    } catch (err) {
      if (err instanceof Error) {
        const { message, name, stack } = err;
        logger.error(`${name}: ${message}`, { stack });
      } else logger.error(err);

      throw new UnauthorizedError();
    }
  };

  return {
    verifyPassword,
    adminLogin,
    emailLogin,
    aliasLogin,
    tokenLogin,
    refresh,
  };
};

export default authenticationService;

export type AuthenticationService = ReturnType<typeof authenticationService>;
