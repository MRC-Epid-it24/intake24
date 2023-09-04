import type { AuthenticationResponseJSON } from '@simplewebauthn/typescript-types';
import type { Request } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { Subject } from '@intake24/common/security';
import type { FrontEnd } from '@intake24/common/types';
import type {
  AliasLoginRequest,
  EmailLoginRequest,
  MFAAuthResponse,
  TokenLoginRequest,
} from '@intake24/common/types/http';
import type { UserPassword } from '@intake24/db';
import { UnauthorizedError } from '@intake24/api/http/errors';
import { surveyRespondent } from '@intake24/common/security';
import { supportedAlgorithms } from '@intake24/common-backend';
import { MFADevice, Op, Survey, User } from '@intake24/db';

import type { Tokens } from '.';

export type LoginCredentials<T extends FrontEnd = FrontEnd> = {
  user: User | null;
  password: string;
  subject: Subject;
  frontEnd: T;
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

export type MFALoginCredentials = {
  userId: string;
  device: MFADevice;
};

export type MFVerification = {
  response: AuthenticationResponseJSON;
  token: string;
};

const authenticationService = ({
  jwtRotationService,
  jwtService,
  logger: globalLogger,
  signInService,
  duoProvider,
  otpProvider,
  fidoProvider,
}: Pick<
  IoC,
  | 'jwtRotationService'
  | 'jwtService'
  | 'logger'
  | 'signInService'
  | 'duoProvider'
  | 'otpProvider'
  | 'fidoProvider'
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
   * Process MFA authentication challenge
   *
   * @param {{ userId: string; email: string }} credentials
   * @param {LoginMeta} meta
   * @returns {Promise<MFAAuthResponse>}
   */
  const processMFA = async (
    credentials: { userId: string; email: string },
    meta: LoginMeta
  ): Promise<MFAAuthResponse> => {
    const { userId, email } = credentials;
    const {
      ip: remoteAddress,
      headers: { 'user-agent': userAgent },
    } = meta.req;

    const signInAttempt: SignInAttempt = {
      provider: 'email',
      providerKey: email,
      userId,
      remoteAddress,
      userAgent,
      successful: false,
    };

    const devices = await MFADevice.findAll({
      where: { userId },
      include: [{ association: 'authenticator' }, { association: 'user' }],
      order: [
        ['preferred', 'DESC'],
        ['id', 'ASC'],
      ],
    });

    if (!devices.length) {
      await signInService.log({ ...signInAttempt, message: 'No MFA devices found for this user.' });
      throw new UnauthorizedError('No MFA devices found.');
    }

    const [device] = devices;
    const { id: deviceId, provider } = device;
    const providers = { duo: duoProvider, otp: otpProvider, fido: fidoProvider };

    const challenge = await providers[provider].authenticationChallenge(device);

    const { challengeId } = challenge;
    meta.req.session.mfaAuthChallenge = { challengeId, deviceId, provider, userId };

    await signInService.log({ ...signInAttempt, successful: true });

    return { challenge, devices };
  };

  /**
   * Login helper with common login logic
   *
   * @param {LoginCredentials} credentials
   * @param {LoginMeta} meta
   * @returns {Promise<Tokens | MFAAuthResponse>}
   */
  const processLogin = async <T extends FrontEnd>(
    credentials: LoginCredentials<T>,
    meta: LoginMeta
  ): Promise<T extends 'survey' ? Tokens : MFAAuthResponse | Tokens> => {
    const { user, password, subject, frontEnd } = credentials;
    const {
      ip: remoteAddress,
      headers: { 'user-agent': userAgent },
    } = meta.req;

    const signInAttempt: SignInAttempt = {
      ...subject,
      userId: user?.id,
      remoteAddress,
      userAgent,
      successful: false,
    };

    if (!user) {
      await signInService.log({ ...signInAttempt, message: 'Credentials not found in database.' });
      throw new UnauthorizedError('Provided credentials do not match our records.');
    }

    if (user.isDisabled()) {
      await signInService.log({ ...signInAttempt, message: 'Account is disabled.' });
      throw new UnauthorizedError('Account is disabled.');
    }

    if (subject.provider !== 'URLToken' && !(await verifyPassword(password, user.password))) {
      await signInService.log({ ...signInAttempt, message: 'Credentials do not match.' });
      throw new UnauthorizedError('Provided credentials do not match our records.');
    }

    const { id: userId, email, aliases } = user;
    const surveyId = aliases?.[0]?.survey?.slug;

    if (frontEnd === 'admin' && user.multiFactorAuthentication && email)
      //@ts-expect-error fix type
      return processMFA({ email, userId }, meta);

    await signInService.log({ ...signInAttempt, successful: true });

    return jwtService.issueTokens({ surveyId, userId }, subject, frontEnd);
  };

  /**
   * Email login to admin application
   *
   * @param {EmailLoginRequest} credentials
   * @param {LoginMeta} meta
   * @returns {(Promise<Tokens | MFAAuthResponse>)}
   */
  const adminLogin = async (
    credentials: EmailLoginRequest,
    meta: LoginMeta
  ): Promise<Tokens | MFAAuthResponse> => {
    const { email, password } = credentials;

    const op = User.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;
    const user = await User.findOne({
      where: { email: { [op]: email } },
      include: [{ association: 'password', required: true }],
    });

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
        {
          association: 'aliases',
          where: { username, surveyId: survey.id },
          include: [{ association: 'survey', attributes: ['slug'] }],
        },
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
        {
          association: 'aliases',
          where: { urlAuthToken: token },
          include: [{ association: 'survey', attributes: ['slug'] }],
        },
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
      const {
        userId,
        sub: subject,
        // @ts-expect-error - TS does not narrow down surveyId based on above condition
        surveyId,
      } = await jwtService.verifyRefreshToken(token, frontEnd);

      const user = await User.findByPk(userId);
      if (!user) throw new UnauthorizedError();

      const valid = await jwtRotationService.verifyAndRevoke(token);
      if (!valid) throw new UnauthorizedError();

      return await jwtService.issueTokens({ surveyId, userId }, subject, frontEnd);
    } catch (err) {
      if (err instanceof Error) {
        const { message, name, stack } = err;
        logger.error(`${name}: ${message}`, { stack });
      } else logger.error(err);

      throw new UnauthorizedError();
    }
  };

  const verify = async ({ response, token }: MFVerification, meta: LoginMeta): Promise<Tokens> => {
    const {
      ip: remoteAddress,
      headers: { 'user-agent': userAgent },
      session: { mfaAuthChallenge },
      body,
    } = meta.req;

    const signInAttempt: SignInAttempt = {
      provider: mfaAuthChallenge?.provider ?? body.provider,
      providerKey: token ?? response?.id,
      userId: mfaAuthChallenge?.userId,
      remoteAddress,
      userAgent,
      successful: false,
    };

    try {
      if (!mfaAuthChallenge?.challengeId) {
        await signInService.log({ ...signInAttempt, message: 'MFA: missing / invalid session.' });
        throw new UnauthorizedError();
      }

      const { challengeId, deviceId, provider, userId } = mfaAuthChallenge;
      signInAttempt.userId = userId;

      const device = await MFADevice.findOne({
        attributes: ['id', 'secret'],
        where: { id: deviceId, provider, userId },
        include: [{ association: 'user', required: true }, { association: 'authenticator' }],
      });

      if (!device || !device.user?.email || (provider === 'fido' && !device.authenticator)) {
        await signInService.log({
          ...signInAttempt,
          message: 'MFA: No device with corresponding credentials found.',
        });
        throw new UnauthorizedError();
      }

      const {
        authenticator,
        user: { email },
        secret,
      } = device;

      const providers = { duo: duoProvider, otp: otpProvider, fido: fidoProvider };

      await providers[provider].authenticationVerification({
        // @ts-expect-error - TS does not narrow down authenticator based on above condition
        authenticator,
        email,
        token,
        challengeId,
        response,
        secret,
      });

      const [tokens] = await Promise.all([
        jwtService.issueTokens({ userId }, { provider: 'email', providerKey: email }, 'admin'),
        signInService.log({ ...signInAttempt, successful: true }),
      ]);

      return tokens;
    } catch (err) {
      if (err instanceof Error) {
        const { message, name, stack } = err;
        logger.debug(`${name}: ${message}`, { stack });

        await signInService.log({ ...signInAttempt, message });
      }

      throw new UnauthorizedError();
    } finally {
      delete meta.req.session.mfaAuthChallenge;
    }
  };

  return {
    verifyPassword,
    adminLogin,
    emailLogin,
    aliasLogin,
    tokenLogin,
    refresh,
    verify,
  };
};

export default authenticationService;

export type AuthenticationService = ReturnType<typeof authenticationService>;
