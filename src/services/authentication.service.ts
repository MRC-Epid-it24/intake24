import { PassportStatic } from 'passport';
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import config from '@/config/security';
import User from '@/db/models/system/user';
import UnauthorizedError from '@/http/errors/unauthorized.error';
import jwtSvc from './jwt.service';

const { jwt } = config;

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwt.access.secret,
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
   * Issue new access token using refresh token
   *
   * @param {string} token
   * @returns {Promise<string>}
   */
  async refresh(token: string): Promise<string> {
    try {
      const { userId } = await jwtSvc.verifyRefreshToken(token);
      const user = await User.scope('roles').findByPk(userId);
      if (!user) throw new UnauthorizedError();

      const roles = user.roleList();
      return await jwtSvc.signAccessToken({ userId, roles });
    } catch (err) {
      throw new UnauthorizedError();
    }
  },
};
