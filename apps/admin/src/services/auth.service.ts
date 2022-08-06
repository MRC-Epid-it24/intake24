import type {
  EmailLoginRequest,
  LoginResponse,
  MFAResponse,
  MFAVerifyRequest,
} from '@intake24/common/types/http';

import http from './http.service';

export type AuthResponse = LoginResponse | MFAResponse;

export default {
  /**
   * Login the user and store the access token to token service.
   *
   * @param {EmailLoginRequest} request
   * @returns {Promise<AuthResponse>}
   */
  async login(request: EmailLoginRequest): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('admin/auth/login', request, {
      withCredentials: true,
    });

    return data;
  },

  /**
   * Verify multi-factor challenge response
   *
   * @param {MFAVerifyRequest} request
   * @returns {Promise<string>}
   */
  async verify({ code, state }: MFAVerifyRequest): Promise<string> {
    const {
      data: { accessToken },
    } = await http.post<LoginResponse>(
      'admin/auth/verify',
      { code, state },
      { withCredentials: true }
    );

    return accessToken;
  },

  /**
   * Refresh access token and store the access token to token service.
   *
   * @returns {Promise<string>}
   */
  async refresh(): Promise<string> {
    const {
      data: { accessToken },
    } = await http.post<LoginResponse>('admin/auth/refresh', null, { withCredentials: true });

    return accessToken;
  },

  /**
   * Logout user
   *
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    await http.post('admin/auth/logout', null, { withCredentials: true });
  },
};
