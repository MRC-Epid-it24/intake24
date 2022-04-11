import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';
import { useLoading } from '@intake24/ui/stores';
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
    setAccessToken(token: string) {
      useUser().load(token);
      this.accessToken = token;
    },

    async authenticate(payload: AuthenticatePayload) {
      const loading = useLoading();
      loading.addItem('login');

      try {
        const accessToken =
          payload.type === 'login'
            ? await authSvc.login(payload.payload)
            : await authSvc.token(payload.payload);

        this.setAccessToken(accessToken);
        this.error = null;

        return Promise.resolve();
      } catch (err) {
        if (axios.isAxiosError(err)) this.error = err;

        return Promise.reject(err);
      } finally {
        loading.removeItem('login');
      }
    },

    async login(payload: LoginRequest) {
      await this.authenticate({ type: 'login', payload });
    },

    async token(payload: TokenRequest) {
      await this.authenticate({ type: 'token', payload });
    },

    async refresh(withErr = true) {
      try {
        const accessToken = await authSvc.refresh();

        this.setAccessToken(accessToken);
        this.error = null;

        return Promise.resolve();
      } catch (err) {
        if (axios.isAxiosError(err)) this.error = err;

        return withErr ? Promise.reject(err) : Promise.resolve();
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

export type AuthStoreDef = typeof useAuth;

export type AuthStore = ReturnType<AuthStoreDef>;
