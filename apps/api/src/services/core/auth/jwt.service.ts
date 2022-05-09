import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { randomString } from '@intake24/common/util';
import { SignPayload, Subject, TokenPayload } from '@intake24/common/security';
import { InternalServerError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import { btoa } from '@intake24/api/util';
import { FrontEnd } from '@intake24/common/types';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const jwtService = ({
  jwtRotationService,
  securityConfig,
}: Pick<IoC, 'jwtRotationService' | 'securityConfig'>) => {
  /**
   * Sign a token
   *
   * @param {(string | Buffer | object)} payload
   * @param {Secret} secret
   * @param {SignOptions} [options={}]
   * @returns {Promise<string>}
   */
  const sign = async (
    payload: string | Buffer | object,
    secret: Secret,
    options: SignOptions = {}
  ): Promise<string> =>
    new Promise((resolve, reject) => {
      const jwtid = randomString(64);
      const { issuer } = securityConfig.jwt;

      jwt.sign(payload, secret, { jwtid, issuer, ...options }, (err, encoded) =>
        err || !encoded ? reject(err ?? new Error('Unable to sign token.')) : resolve(encoded)
      );
    });

  /**
   * Verify token
   *
   * @param {string} token
   * @param {Secret} secret
   * @param {SignOptions} [options={}]
   * @returns {Promise<TokenPayload>}
   */
  const verify = async (
    token: string,
    secret: Secret,
    options: SignOptions = {}
  ): Promise<TokenPayload> =>
    new Promise((resolve, reject) => {
      const { issuer } = securityConfig.jwt;

      jwt.verify(token, secret, { issuer, ...options }, (err, decoded) =>
        err || !decoded
          ? reject(err ?? new Error('Unable to verify refresh token.'))
          : resolve(decoded as TokenPayload)
      );
    });

  /**
   * Sign access token
   *
   * @param {SignPayload} payload
   * @param {FrontEnd} frontEnd
   * @param {SignOptions} [options={}]
   * @returns {Promise<string>}
   */
  const signAccessToken = async (
    payload: SignPayload,
    frontEnd: FrontEnd,
    options: SignOptions = {}
  ): Promise<string> => {
    const {
      secret,
      [frontEnd]: {
        access: { lifetime, audience },
      },
    } = securityConfig.jwt;

    if (!secret) throw new InternalServerError('No access token secret defined.');

    return sign(payload, secret, { audience, expiresIn: lifetime, ...options });
  };

  /**
   * Sign refresh token
   *
   * @param {SignPayload} payload
   * @param {FrontEnd} frontEnd
   * @param {SignOptions} [options={}]
   * @returns {Promise<string>}
   */
  const signRefreshToken = async (
    payload: SignPayload,
    frontEnd: FrontEnd,
    options: SignOptions = {}
  ): Promise<string> => {
    const { secret, lifetime, audience } = securityConfig.jwt[frontEnd].refresh;

    if (!secret) throw new InternalServerError('No refresh token secret defined.');

    return sign(payload, secret, { audience, expiresIn: lifetime, ...options });
  };

  /**
   * Sign both access and refresh tokens
   *
   * @param {SignPayload} payload
   * @param {FrontEnd} frontEnd
   * @param {SignOptions} [options={}]
   * @returns {Promise<Tokens>}
   */
  const signTokens = async (
    payload: SignPayload,
    frontEnd: FrontEnd,
    options: SignOptions = {}
  ): Promise<Tokens> => {
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(payload, frontEnd, options),
      signRefreshToken(payload, frontEnd, options),
    ]);

    return { accessToken, refreshToken };
  };

  /**
   * Verify validity of refresh token
   *
   * @param {string} token
   * @returns {TokenPayload}
   */
  const verifyRefreshToken = async (token: string, frontEnd: FrontEnd): Promise<TokenPayload> => {
    const { secret, audience } = securityConfig.jwt[frontEnd].refresh;
    return verify(token, secret, { audience });
  };

  /**
   * Decode token
   *
   * @param {string} token
   * @returns {TokenPayload}
   */
  const decodeToken = (token: string): TokenPayload => jwt.decode(token) as TokenPayload;

  /**
   * Issue JWT tokens and log for rotation
   *
   * @param {string} userId
   * @param {(Subject | string)} subject
   * @param {FrontEnd} frontEnd
   * @returns {Promise<Tokens>}
   */
  const issueTokens = async (
    userId: string,
    subject: Subject | string,
    frontEnd: FrontEnd
  ): Promise<Tokens> => {
    const payload: SignPayload = { userId };

    const { accessToken, refreshToken } = await signTokens(payload, frontEnd, {
      subject: typeof subject === 'string' ? subject : btoa(subject),
    });
    await jwtRotationService.store(refreshToken, userId);

    return { accessToken, refreshToken };
  };

  return {
    sign,
    signAccessToken,
    signRefreshToken,
    signTokens,
    decodeToken,
    verifyRefreshToken,
    issueTokens,
  };
};

export default jwtService;

export type JwtService = ReturnType<typeof jwtService>;
