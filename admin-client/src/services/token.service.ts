import Vue from 'vue';
import jwtDecode from 'jwt-decode';
import { ACCESS_TOKEN, JwtPayload, Subject, UserPayload } from '@/types/auth';

export default {
  getAccessToken(): string | null {
    return Vue.ls.get(ACCESS_TOKEN);
  },

  decodeAccessToken(): UserPayload | null {
    try {
      const content = this.getAccessToken();
      if (!content) return null;

      const { userId, roles = [], exp, sub } = jwtDecode<JwtPayload>(content);
      const provider = JSON.parse(atob(sub)) as Subject;

      if (!userId || !roles.length || new Date().getTime() > exp * 1000) return null;

      return { userId, provider, roles } as UserPayload;
    } catch {
      return null;
    }
  },

  saveAccessToken(accessToken: string): void {
    Vue.ls.set(ACCESS_TOKEN, accessToken);
  },

  clearAccessToken(): void {
    Vue.ls.remove(ACCESS_TOKEN);
  },

  clearTokens(): void {
    this.clearAccessToken();
  },
};
