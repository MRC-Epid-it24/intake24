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
    } = await http.post<AuthResponse>('login/alias', request);

    tokenSvc.saveAccessToken(accessToken);
    return accessToken;
  },

  async token(request: TokenRequest): Promise<string> {
    const {
      data: { accessToken },
    } = await http.post<AuthResponse>(`login/token`, request);

    tokenSvc.saveAccessToken(accessToken);
    return accessToken;
  },

  async refresh(): Promise<string> {
    const {
      data: { accessToken },
    } = await http.post<AuthResponse>('refresh');

    tokenSvc.saveAccessToken(accessToken);
    return accessToken;
  },

  async logout(): Promise<void> {
    await http.post('logout');
    tokenSvc.clearTokens();
  },
};
