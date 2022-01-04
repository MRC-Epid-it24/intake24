import { PassportStatic } from 'passport';
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import security from '@api/config/security';
import { User } from '@intake24/db';

const { issuer, access } = security.jwt;

export const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: access.secret,
  issuer,
};

export const buildJwtStrategy = (): Strategy =>
  new Strategy(opts, async ({ userId }, done) => {
    try {
      const user = await User.findByPk(userId);
      done(null, user ?? false);
    } catch (err) {
      done(err, false);
    }
  });

export default (passport: PassportStatic): void => {
  passport.use('user', buildJwtStrategy());
  passport.use('admin', buildJwtStrategy());
};
