import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { InternalServerError } from '@/http/errors';
import type { IoC } from '@/ioc';

export type SubjectProvider = 'email' | 'surveyAlias' | 'URLToken';

export type Subject = { providerID: SubjectProvider; providerKey: string };

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export interface SignPayload {
  userId: number;
}

export interface TokenPayload extends SignPayload {
  sub: string;
  jti: string;
  aud: string;
  iss: string;
  iat: number;
  exp: number;
}

export interface JwtService {
  sign: (payload: SignPayload, secret: string, options?: SignOptions) => Promise<string>;
  signAccessToken: (payload: SignPayload, options?: SignOptions) => Promise<string>;
  signRefreshToken: (payload: SignPayload, options?: SignOptions) => Promise<string>;
  signTokens: (payload: SignPayload, options?: SignOptions) => Promise<Tokens>;
  verifyRefreshToken: (token: string) => Promise<TokenPayload>;
}

export default ({ config }: IoC): JwtService => {
  const { issuer, access, refresh } = config.security.jwt;
  const signOptions: SignOptions = { issuer };
  const verifyOptions: VerifyOptions = { audience: 'refresh', issuer };

  /**
   * Sign a token
   *
   * @param {SignPayload} payload
   * @param {string} secret
   * @param {SignOptions} [options={}]
   * @returns {Promise<string>}
   */
  const sign = async (
    payload: SignPayload,
    secret: string,
    options: SignOptions = {}
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const jwtid = nanoid(64);
      jwt.sign(payload, secret, { jwtid, ...signOptions, ...options }, (err, encoded) =>
        err || !encoded ? reject(err ?? new Error('Unable to sign token.')) : resolve(encoded)
      );
    });
  };

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
  const verifyRefreshToken = async (token: string): Promise<TokenPayload> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, refresh.secret, verifyOptions, (err, decoded) =>
        err || !decoded
          ? reject(err ?? new Error('Unable to verify refresh token.'))
          : resolve(decoded as TokenPayload)
      );
    });
  };

  return {
    sign,
    signAccessToken,
    signRefreshToken,
    signTokens,
    verifyRefreshToken,
  };
};
