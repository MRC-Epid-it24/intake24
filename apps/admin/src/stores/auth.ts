import { defineStore } from 'pinia';
import authSvc, { LoginRequest, MFAVerifyRequest } from '@intake24/admin/services/auth.service';
import { AxiosError } from 'axios';
import { useLoading } from './loading';
import { useUser } from './user';

export type AuthState = {
  accessToken: string | null;
  mfaRequestUrl: string | null;
  error: AxiosError | null;
};

export const useAuth = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    mfaRequestUrl: null,
    error: null,
  }),
  getters: {
    loggedIn: (state) => !!state.accessToken,
  },
  actions: {
    async login(payload: LoginRequest) {
      const loading = useLoading();
      loading.addItem('login');

      try {
        const data = await authSvc.login(payload);

        if ('accessToken' in data) await this.successfulLogin(data.accessToken);
        else this.mfaRequest(data.mfaRequestUrl);

        Promise.resolve();
      } catch (err: any) {
        this.error = err;
        Promise.reject(err);
      } finally {
        loading.removeItem('login');
      }
    },

    async verify(request: MFAVerifyRequest) {
      const loading = useLoading();
      loading.addItem('verify');

      try {
        const accessToken = await authSvc.verify(request);
        await this.successfulLogin(accessToken);
        Promise.resolve();
      } catch (err: any) {
        this.error = err;
        Promise.reject(err);
      } finally {
        loading.removeItem('verify');
      }
    },

    async refresh(withErr = true) {
      try {
        this.accessToken = await authSvc.refresh();
        this.error = null;

        const userState = useUser();
        if (!userState.loaded) await userState.request();

        Promise.resolve();
      } catch (err: any) {
        this.error = err;

        if (withErr) Promise.reject(err);
        else Promise.resolve();
      }
    },

    async logout(invalidate?: boolean) {
      if (invalidate) await authSvc.logout();

      useLoading().$reset();
      useUser().$reset();
      this.$reset();
    },

    async successfulLogin(accessToken: string) {
      this.error = null;
      this.mfaRequestUrl = null;
      this.accessToken = accessToken;

      await useUser().request();
    },

    mfaRequest(url: string) {
      this.error = null;
      this.accessToken = null;
      this.mfaRequestUrl = url;
    },
  },
});
