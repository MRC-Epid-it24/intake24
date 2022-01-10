import jwtDecode from 'jwt-decode';
import { JwtPayload, Subject, UserPayload } from '@intake24/survey/types/auth';

export default {
  decodeAccessToken(accessToken: string): UserPayload | null {
    try {
      const { userId, exp, sub } = jwtDecode<JwtPayload>(accessToken);
      const provider = JSON.parse(atob(sub)) as Subject;

      if (!userId || new Date().getTime() > exp * 1000) return null;

      return { userId, provider } as UserPayload;
    } catch {
      return null;
    }
  },
};
