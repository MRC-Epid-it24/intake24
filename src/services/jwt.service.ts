import jwt, { SignOptions } from 'jsonwebtoken';
import auth from '@/config/auth';
import InternalServerError from '@/http/errors/internal-server.error';

const { jwt: config } = auth;

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: number;
  type: string;
  roles: string[];
}

export default {
  /**
   * Sign a token
   *
   * @param {TokenPayload} payload
   * @param {string} secret
   * @param {SignOptions} [options={}]
   * @returns {Promise<string>}
   */
  async sign(payload: TokenPayload, secret: string, options: SignOptions = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, options, (err, encoded) =>
        err || !encoded ? reject(err ?? new Error(`Unable to sign token`)) : resolve(encoded)
      );
    });
  },

  /**
   * Sign access token
   *
   * @param {TokenPayload} payload
   * @param {SignOptions} [options={}]
   * @returns {string}
   */
  async signAccessToken(payload: TokenPayload, options: SignOptions = {}): Promise<string> {
    const { secret, lifetime } = config.access;

    if (!secret.length) throw new InternalServerError('No access token secret defined');

    return this.sign(payload, secret, { expiresIn: lifetime, ...options });
  },

  /**
   * Sign refresh token
   *
   * @param {TokenPayload} payload
   * @param {SignOptions} [options={}]
   * @returns {string}
   */
  async signRefreshToken(payload: TokenPayload, options: SignOptions = {}): Promise<string> {
    const { secret, lifetime } = config.refresh;

    if (!secret.length) throw new InternalServerError('No refresh token secret defined');

    return this.sign(payload, secret, { expiresIn: lifetime, ...options });
  },

  /**
   * Sign both access and refresh tokens
   *
   * @param {TokenPayload} payload
   * @param {SignOptions} [options={}]
   * @returns {Tokens}
   */
  async signTokens(payload: TokenPayload, options: SignOptions = {}): Promise<Tokens> {
    const accessToken = await this.signAccessToken(payload, options);
    const refreshToken = await this.signRefreshToken(payload, options);

    return { accessToken, refreshToken };
  },

  /**
   * Verify validity of refresh token
   *
   * @param {string} token
   * @returns {TokenPayload}
   */
  verifyRefreshToken(token: string): Promise<TokenPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.refresh.secret, (err, decoded) =>
        err || !decoded
          ? reject(err ?? new Error(`Unable to verify refresh token`))
          : resolve(decoded as TokenPayload)
      );
    });
  },
};
