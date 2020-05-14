import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { PassportStatic } from 'passport';
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import security from '@/config/security';
import User from '@/db/models/system/user';
import InternalServerError from '@/http/errors/internal-server.error';

const { issuer, access, refresh } = security.jwt;

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: number;
  roles: string[];
  type?: string;
}

const signOptions: SignOptions = { issuer };

const verifyOptions: VerifyOptions = { issuer };

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // TODO: compatibility fallback -> combine Bearer & x-auth-token extraction strategy?
  // jwtFromRequest: ExtractJwt.fromHeader('x-auth-token'),
  secretOrKey: access.secret,
  issuer,
};

export const jwtStrategy = (passport: PassportStatic): void => {
  passport.use(
    new Strategy(opts, ({ userId }, done) => {
      User.scope('roles')
        .findByPk(userId)
        .then((user) => {
          if (user) done(null, user);
          else done(null, false);

          // returning callback gives Bluebird promise warning
          return null;
        })
        .catch((err) => {
          return done(err);
        });
    })
  );
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
