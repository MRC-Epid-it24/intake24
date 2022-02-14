import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';
import { useLoading } from './loading';
import { useUser } from './user';
import authSvc, { LoginRequest, TokenRequest } from '../services/auth.service';

export type AuthState = {
  accessToken: string | null;
  error: AxiosError | null;
};

export type LoginPayload = { type: 'login'; payload: LoginRequest };
export type TokenPayload = { type: 'token'; payload: TokenRequest };
export type AuthenticatePayload = LoginPayload | TokenPayload;

export const useAuth = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    error: null,
  }),
  getters: {
    loggedIn: (state) => !!state.accessToken,
  },
  actions: {
    async login(payload: LoginRequest) {
      await this.authenticate({ type: 'login', payload });
    },

    async token(payload: TokenRequest) {
      await this.authenticate({ type: 'token', payload });
    },

    async authenticate(payload: AuthenticatePayload) {
      const loading = useLoading();
      loading.addItem('login');

      try {
        const accessToken =
          payload.type === 'login'
            ? await authSvc.login(payload.payload)
            : await authSvc.token(payload.payload);

        this.error = null;
        this.accessToken = accessToken;
        useUser().load(accessToken);

        Promise.resolve();
      } catch (err: any) {
        if (axios.isAxiosError(err)) this.error = err;

        Promise.reject(err);
      } finally {
        loading.removeItem('login');
      }
    },

    async refresh(withErr = true) {
      try {
        const accessToken = await authSvc.refresh();
        this.accessToken = accessToken;
        this.error = null;

        useUser().load(accessToken);

        Promise.resolve();
      } catch (err) {
        if (axios.isAxiosError(err)) this.error = err;

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
  },
});
