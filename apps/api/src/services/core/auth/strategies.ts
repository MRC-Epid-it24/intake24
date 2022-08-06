import type { PassportStatic } from 'passport';
import type { StrategyOptions } from 'passport-jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { FrontEnd } from '@intake24/common/types';
import security from '@intake24/api/config/security';
import { User } from '@intake24/db';

const { issuer, secret } = security.jwt;

export const opts: Record<FrontEnd, StrategyOptions> = {
  admin: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
    issuer,
    audience: 'access',
  },
  survey: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
    issuer,
    audience: 'access',
  },
};

export const buildJwtStrategy = (frontEnd: FrontEnd): Strategy =>
  new Strategy(opts[frontEnd], async ({ userId }, done) => {
    try {
      const user = await User.findByPk(userId);
      done(null, user ?? false);
    } catch (err) {
      done(err, false);
    }
  });

export default (passport: PassportStatic): void => {
  passport.use('survey', buildJwtStrategy('survey'));
  passport.use('admin', buildJwtStrategy('admin'));
};
