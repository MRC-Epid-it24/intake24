import jwtDecode from 'jwt-decode';
import { TokenPayload } from '@intake24/common/security';
import { FrontEnd } from '@intake24/common/types';

export default {
  decodeAccessToken(accessToken: string, frontEnd: FrontEnd): TokenPayload {
    const payload = jwtDecode<TokenPayload>(accessToken);
    const { userId, aud, exp } = payload;

    if (!aud.includes('access') || !aud.includes(frontEnd))
      throw new Error('JWT: invalid audience claims');

    if (!userId) throw new Error('JWT: Missing userId claim');

    if (new Date().getTime() > exp * 1000) throw new Error('JWT: expired token');

    return payload;
  },
};
