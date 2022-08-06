import type { AliasLoginRequest, TokenLoginRequest } from '@intake24/common/types/http';

import http from './http.service';

export type AuthResponse = { accessToken: string };

export default {
  async login(request: AliasLoginRequest): Promise<string> {
    const {
      data: { accessToken },
    } = await http.post<AuthResponse>('auth/login/alias', request, { withCredentials: true });

    return accessToken;
  },

  async token(request: TokenLoginRequest): Promise<string> {
    const {
      data: { accessToken },
    } = await http.post<AuthResponse>(`auth/login/token`, request, { withCredentials: true });

    return accessToken;
  },

  async refresh(): Promise<string> {
    const {
      data: { accessToken },
    } = await http.post<AuthResponse>('auth/refresh', null, { withCredentials: true });

    return accessToken;
  },

  async logout(): Promise<void> {
    await http.post('auth/logout', null, { withCredentials: true });
  },
};
