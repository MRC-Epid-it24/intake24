import { LoginResponse, MFAResponse } from '@common/types/http';
import http from './http.service';

export type LoginRequest = { email: string; password: string };

export type MFAVerifyRequest = { code: string; state: string };

export type AuthResponse = LoginResponse | MFAResponse;

export default {
  /**
   * Login the user and store the access token to token service.
   *
   * @param {LoginRequest} request
   * @returns {Promise<AuthResponse>}
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('auth/login', request, {
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
      'auth/login/verify',
      { code, state },
      { withCredentials: true }
    );

    return accessToken;
  },

  /* async password(email: string, recaptchaResponse: string): Promise<string> {
    
  }, */

  /**
   * Refresh access token and store the access token to token service.
   *
   * @returns {Promise<string>}
   */
  async refresh(): Promise<string> {
    const {
      data: { accessToken },
    } = await http.post<LoginResponse>('auth/refresh', null, { withCredentials: true });

    return accessToken;
  },

  /**
   * Logout user
   *
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    await http.post('auth/logout', null, { withCredentials: true });
  },
};
