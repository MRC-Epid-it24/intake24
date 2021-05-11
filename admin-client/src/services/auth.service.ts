import http from './http.service';
import tokenSvc from './token.service';

export type LoginRequest = { email: string; password: string };

export type AuthResponse = { accessToken: string };

export type MfaRequest = { mfa: { request: string; host: string } };

export type AuthResponseOrMfaChallenge = { accessToken?: string; mfa?: MfaRequest };

export default {
  /**
   * Login the user and store the access token to token service.
   *
   * @param {LoginRequest} request
   * @returns {Promise<AuthOrMfaChallengeResponse>}
   */
  async login(request: LoginRequest): Promise<AuthResponseOrMfaChallenge> {
    const {
      data: { accessToken, mfa },
    } = await http.post<AuthResponseOrMfaChallenge>('auth/login', request, {
      withCredentials: true,
    });

    if (accessToken) tokenSvc.saveAccessToken(accessToken);
    return { accessToken, mfa };
  },

  /**
   * Verify multi-factor challenge response
   *
   * @param {string} sigResponse
   * @returns {Promise<string>}
   */
  async verify(sigResponse: string): Promise<string> {
    const {
      data: { accessToken },
    } = await http.post<AuthResponse>(
      'auth/login/verify',
      { sigResponse },
      { withCredentials: true }
    );

    tokenSvc.saveAccessToken(accessToken);
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
    } = await http.post<AuthResponse>('auth/refresh', null, { withCredentials: true });

    tokenSvc.saveAccessToken(accessToken);
    return accessToken;
  },

  /**
   * Logout user
   *
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    await http.post('auth/logout', null, { withCredentials: true });
    tokenSvc.clearTokens();
  },
};
