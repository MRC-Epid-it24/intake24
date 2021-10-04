import http from './http.service';

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

    return accessToken;
  },

  async token(request: TokenRequest): Promise<string> {
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
    await http.post('auth/logout');
  },
};
