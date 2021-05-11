import http from './http.service';
import tokenSvc from './token.service';

export type LoginRequest = {
  userName: string;
  password: string;
  surveyId: string;
};

export type TokenRequest = { token: string };

export type AuthResponse = { accessToken: string };

export default {
  async login(request: LoginRequest): Promise<string> {
    const {
      data: { accessToken },
    } = await http.post<AuthResponse>('auth/login/alias', request, { withCredentials: true });

    tokenSvc.saveAccessToken(accessToken);
    return accessToken;
  },

  async token(request: TokenRequest): Promise<string> {
    const {
      data: { accessToken },
    } = await http.post<AuthResponse>(`auth/login/token`, request, { withCredentials: true });

    tokenSvc.saveAccessToken(accessToken);
    return accessToken;
  },

  async refresh(): Promise<string> {
    const {
      data: { accessToken },
    } = await http.post<AuthResponse>('auth/refresh', null, { withCredentials: true });

    tokenSvc.saveAccessToken(accessToken);
    return accessToken;
  },

  async logout(): Promise<void> {
    await http.post('auth/logout');
    tokenSvc.clearTokens();
  },
};
