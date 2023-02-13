import { defineStore } from 'pinia';

import type {
  EmailLoginRequest,
  MFAAuthenticationVerificationRequest,
  MFAAuthResponse,
} from '@intake24/common/types/http';
import { authService } from '@intake24/admin/services';
import { useLoading } from '@intake24/ui/stores';

import { useUser } from './user';

export type AuthState = {
  accessToken: string | null;
  mfa: MFAAuthResponse | null;
};

export const useAuth = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    mfa: null,
  }),
  getters: {
    loggedIn: (state) => !!state.accessToken,
  },
  actions: {
    setAccessToken(token: string) {
      useUser().loadPayload(token);
      this.accessToken = token;
    },

    async successfulLogin(accessToken: string) {
      this.setAccessToken(accessToken);
      this.mfa = null;

      const userState = useUser();
      if (!userState.loaded) await userState.request();
    },

    mfaRequest(challenge: MFAAuthResponse) {
      this.accessToken = null;
      this.mfa = challenge;
    },

    async login(payload: EmailLoginRequest) {
      const data = await authService.login(payload);

      if ('accessToken' in data) await this.successfulLogin(data.accessToken);
      else this.mfaRequest(data);
    },

    async verify(request: MFAAuthenticationVerificationRequest) {
      const accessToken = await authService.verify(request);
      await this.successfulLogin(accessToken);
    },

    async refresh(withErr = true) {
      try {
        const accessToken = await authService.refresh();
        await this.successfulLogin(accessToken);
      } catch (err) {
        if (withErr) throw err;
      }
    },

    async logout(invalidate?: boolean) {
      if (invalidate) await authService.logout();

      useLoading().$reset();
      useUser().$reset();
      this.$reset();
    },
  },
});

export type AuthStoreDef = typeof useAuth;

export type AuthStore = ReturnType<AuthStoreDef>;
