import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
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

export type TokenPayload = {
  userId: number;
  type?: string;
  iss?: string;
  sub?: string;
};

const { issuer, access, refresh } = security.jwt;

const signOptions: SignOptions = { issuer };

const verifyOptions: VerifyOptions = { issuer };

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
   * @param {TokenPayload} payload
   * @param {string} secret
   * @param {SignOptions} [options={}]
   * @returns {Promise<string>}
   */
  async sign(payload: TokenPayload, secret: string, options: SignOptions = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, { ...signOptions, ...options }, (err, encoded) =>
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
    const { secret, lifetime } = access;

    if (!secret) throw new InternalServerError('No access token secret defined');

    return this.sign({ type: 'access', ...payload }, secret, { expiresIn: lifetime, ...options });
  },

  /**
   * Sign refresh token
   *
   * @param {TokenPayload} payload
   * @param {SignOptions} [options={}]
   * @returns {string}
   */
  async signRefreshToken(payload: TokenPayload, options: SignOptions = {}): Promise<string> {
    const { secret, lifetime } = refresh;

    if (!secret) throw new InternalServerError('No refresh token secret defined');

    return this.sign({ type: 'refresh', ...payload }, secret, { expiresIn: lifetime, ...options });
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
      jwt.verify(token, refresh.secret, verifyOptions, (err, decoded) =>
        err || !decoded
          ? reject(err ?? new Error(`Unable to verify refresh token`))
          : resolve(decoded as TokenPayload)
      );
    });
  },
};
