import jwt, { Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import type { MFAProvider } from '@api/config';
import { InternalServerError } from '@api/http/errors';
import type { IoC } from '@api/ioc';
import { btoa } from '@api/util';

export type SubjectProvider = 'email' | 'surveyAlias' | 'URLToken';

export type Subject = {
  provider: SubjectProvider | MFAProvider;
  providerKey: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type SignPayload = {
  userId: string;
};

export interface TokenPayload extends SignPayload {
  sub: string;
  jti: string;
  aud: string;
  iss: string;
  iat: number;
  exp: number;
}

const jwtService = ({
  jwtRotationService,
  securityConfig,
}: Pick<IoC, 'jwtRotationService' | 'securityConfig'>) => {
  const { issuer, access, refresh } = securityConfig.jwt;
  const signOptions: SignOptions = { issuer };
  const verifyOptions: VerifyOptions = { audience: 'refresh', issuer };

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
      const jwtid = nanoid(64);
      jwt.sign(payload, secret, { jwtid, ...signOptions, ...options }, (err, encoded) =>
        err || !encoded ? reject(err ?? new Error('Unable to sign token.')) : resolve(encoded)
      );
    });

  /**
   * Sign access token
   *
   * @param {SignPayload} payload
   * @param {SignOptions} [options={}]
   * @returns {string}
   */
  const signAccessToken = async (
    payload: SignPayload,
    options: SignOptions = {}
  ): Promise<string> => {
    const { secret, lifetime } = access;

    if (!secret) throw new InternalServerError('No access token secret defined.');

    return sign(payload, secret, { audience: 'access', expiresIn: lifetime, ...options });
  };

  /**
   * Sign refresh token
   *
   * @param {SignPayload} payload
   * @param {SignOptions} [options={}]
   * @returns {string}
   */
  const signRefreshToken = async (
    payload: SignPayload,
    options: SignOptions = {}
  ): Promise<string> => {
    const { secret, lifetime } = refresh;

    if (!secret) throw new InternalServerError('No refresh token secret defined.');

    return sign(payload, secret, { audience: 'refresh', expiresIn: lifetime, ...options });
  };

  /**
   * Sign both access and refresh tokens
   *
   * @param {SignPayload} payload
   * @param {SignOptions} [options={}]
   * @returns {Tokens}
   */
  const signTokens = async (payload: SignPayload, options: SignOptions = {}): Promise<Tokens> => {
    const accessToken = await signAccessToken(payload, options);
    const refreshToken = await signRefreshToken(payload, options);

    return { accessToken, refreshToken };
  };

  /**
   * Verify validity of refresh token
   *
   * @param {string} token
   * @returns {TokenPayload}
   */
  const verifyRefreshToken = async (token: string): Promise<TokenPayload> =>
    new Promise((resolve, reject) => {
      jwt.verify(token, refresh.secret, verifyOptions, (err, decoded) =>
        err || !decoded
          ? reject(err ?? new Error('Unable to verify refresh token.'))
          : resolve(decoded as TokenPayload)
      );
    });

  /**
   * Issue JWT tokens and log for rotation
   *
   * @param {string} userId
   * @param {(Subject | string)} subject
   * @returns {Promise<Tokens>}
   */
  const issueTokens = async (userId: string, subject: Subject | string): Promise<Tokens> => {
    const payload: SignPayload = { userId };

    const { accessToken, refreshToken } = await signTokens(payload, {
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
    verifyRefreshToken,
    issueTokens,
  };
};

export default jwtService;

export type JwtService = ReturnType<typeof jwtService>;
