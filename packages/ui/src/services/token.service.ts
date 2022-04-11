import jwtDecode from 'jwt-decode';
import { TokenPayload } from '@intake24/common/security';

export default {
  decodeAccessToken(accessToken: string): TokenPayload {
    const payload = jwtDecode<TokenPayload>(accessToken);
    const { userId, aud, exp } = payload;

    if (aud !== 'access') throw new Error('JWT: invalid audience claim');

    if (!userId) throw new Error('JWT: Missing userId claim');

    if (new Date().getTime() > exp * 1000) throw new Error('JWT: expired token');

    return payload;
  },
};
