import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { PassportStatic } from 'passport';
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import security from '@/config/security';
import { User } from '@/db/models/system';
import { InternalServerError } from '@/http/errors';

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

const { issuer, access, refresh } = security.jwt;

const signOptions: SignOptions = { issuer };

const verifyOptions: VerifyOptions = { audience: 'refresh', issuer };

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: access.secret,
  issuer,
};

const buildJwtStrategy = (scopes: string[] = []) =>
  new Strategy(opts, async ({ userId }, done) => {
    try {
      const user = await User.scope(scopes).findByPk(userId);
      done(null, user ?? false);
    } catch (err) {
      done(err, false);
    }
  });

export const jwtStrategy = (passport: PassportStatic): void => {
  passport.use('user', buildJwtStrategy(['permissions']));
  passport.use('admin', buildJwtStrategy(['permissions', 'rolesPerms']));
};

export default {
  /**
   * Sign a token
   *
   * @param {SignPayload} payload
   * @param {string} secret
   * @param {SignOptions} [options={}]
   * @returns {Promise<string>}
   */
  async sign(payload: SignPayload, secret: string, options: SignOptions = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      const jwtid = nanoid(64);
      jwt.sign(payload, secret, { jwtid, ...signOptions, ...options }, (err, encoded) =>
        err || !encoded ? reject(err ?? new Error('Unable to sign token.')) : resolve(encoded)
      );
    });
  },

  /**
   * Sign access token
   *
   * @param {SignPayload} payload
   * @param {SignOptions} [options={}]
   * @returns {string}
   */
  async signAccessToken(payload: SignPayload, options: SignOptions = {}): Promise<string> {
    const { secret, lifetime } = access;

    if (!secret) throw new InternalServerError('No access token secret defined.');

    return this.sign(payload, secret, { audience: 'access', expiresIn: lifetime, ...options });
  },

  /**
   * Sign refresh token
   *
   * @param {SignPayload} payload
   * @param {SignOptions} [options={}]
   * @returns {string}
   */
  async signRefreshToken(payload: SignPayload, options: SignOptions = {}): Promise<string> {
    const { secret, lifetime } = refresh;

    if (!secret) throw new InternalServerError('No refresh token secret defined.');

    return this.sign(payload, secret, { audience: 'refresh', expiresIn: lifetime, ...options });
  },

  /**
   * Sign both access and refresh tokens
   *
   * @param {SignPayload} payload
   * @param {SignOptions} [options={}]
   * @returns {Tokens}
   */
  async signTokens(payload: SignPayload, options: SignOptions = {}): Promise<Tokens> {
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
      jwt.verify(token, refresh.secret, verifyOptions, (err, decoded) =>
        err || !decoded
          ? reject(err ?? new Error('Unable to verify refresh token.'))
          : resolve(decoded as TokenPayload)
      );
    });
  },
};
