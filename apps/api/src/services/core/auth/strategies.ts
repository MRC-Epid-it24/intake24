import type { PassportStatic } from 'passport';
import type { StrategyOptionsWithoutRequest } from 'passport-jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Op } from 'sequelize';

import security from '@intake24/api/config/security';
import type { TokenPayload } from '@intake24/common/security';
import type { FrontEnd } from '@intake24/common/types';
import { User } from '@intake24/db';

const { issuer, secret } = security.jwt;

export const opts: Record<FrontEnd, StrategyOptionsWithoutRequest> = {
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

export function buildJwtStrategy(frontEnd: FrontEnd): Strategy {
  return new Strategy(opts[frontEnd], async (payload: TokenPayload, done) => {
    const { userId, jti, aud } = payload;

    try {
      if (!Array.isArray(aud) || !aud.includes('personal')) {
        done(null, payload ?? false);
        return;
      }

      const user = await User.findOne({
        attributes: ['id'],
        where: { id: userId, disabledAt: null, verifiedAt: { [Op.ne]: null } },
        include: [
          {
            association: 'personalAccessTokens',
            attributes: ['token'],
            where: { token: jti, revoked: false, expiresAt: { [Op.gt]: new Date() } },
          },
        ],
      });

      done(null, user ? payload : false);
    }
    catch (err) {
      done(err, false);
    }
  });
}

export default (passport: PassportStatic): void => {
  passport.use('survey', buildJwtStrategy('survey'));
  passport.use('admin', buildJwtStrategy('admin'));
};
