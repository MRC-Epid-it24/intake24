import type { AxiosError, AxiosResponse } from 'axios';
import axios, { HttpStatusCode } from 'axios';
import axiosRetry from 'axios-retry';
import trim from 'lodash/trim';

import type { HttpClient, HttpRequestConfig, SubscribeCallback } from '@intake24/ui/types';

import type { AuthStoreDef } from '../stores';

let isRefreshing = false;
let tokenSubscribers: SubscribeCallback[] = [];

const subscribeTokenRefresh = (cb: SubscribeCallback) => tokenSubscribers.push(cb);

function onTokenRefreshed(errRefreshing?: AxiosError) {
  return tokenSubscribers.map(cb => cb(errRefreshing));
}

const httpClient: HttpClient = {
  axios: axios.create({
    baseURL: [import.meta.env.VITE_API_HOST, import.meta.env.VITE_API_URL]
      .map(item => trim(item, '/'))
      .join('/'),
    headers: { common: { 'X-Requested-With': 'XMLHttpRequest' } },
  }),

  init(router, useAuth: AuthStoreDef) {
    this.mountInterceptors(router, useAuth);
  },

  async get(url, config) {
    return this.request({ url, method: 'get', ...config });
  },

  async post(url, data, config) {
    return this.request({ url, method: 'post', data, ...config });
  },

  async put(url, data, config) {
    return this.request({ url, method: 'put', data, ...config });
  },

  async patch(url, data, config) {
    return this.request({ url, method: 'patch', data, ...config });
  },

  async delete(url, config) {
    return this.request({ url, method: 'delete', ...config });
  },

  async request<T = any, R = AxiosResponse<T>, D = any>(config: HttpRequestConfig<D>): Promise<R> {
    return this.axios.request<T, R, D>(config);
  },

  mountInterceptors(router, useAuth: AuthStoreDef) {
    this.mountBearerInterceptor(useAuth);
    this.mount401Interceptor(router, useAuth);
  },

  mountBearerInterceptor(useAuth: AuthStoreDef) {
    this.axios.interceptors.request.use((request) => {
      const { accessToken } = useAuth();

      if (accessToken)
        request.headers.Authorization = `Bearer ${accessToken}`;

      return request;
    });
  },

  mount401Interceptor(router, useAuth: AuthStoreDef) {
    const auth = useAuth();

    this.axios.interceptors.response.use(
      response => response,
      async (err: AxiosError) => {
        const { config, response: { status } = {} } = err;

        // Exclude non-401s and sign-in 401s (/login/alias and /login/token/:token)
        if (
          !config?.url
          || status !== HttpStatusCode.Unauthorized
          || config.url?.includes('auth/login')
        ) {
          return Promise.reject(err);
        }

        // Refresh token has failed. Logout the user
        if (config.url?.includes('auth/refresh')) {
          isRefreshing = false;

          await auth.logout();
          const { name, params: { surveyId } = {} } = router.currentRoute;

          if (surveyId && name !== 'survey-login')
            router.push({ name: 'survey-login', params: { surveyId } });

          return Promise.reject(err);
        }

        if (!isRefreshing) {
          isRefreshing = true;

          auth
            .refresh()
            .then(() => {
              isRefreshing = false;
              onTokenRefreshed();
              tokenSubscribers = [];
            })
            .catch(() => {
              isRefreshing = false;
              onTokenRefreshed(err);
              tokenSubscribers = [];
            });
        }

        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((errRefreshing) => {
            if (errRefreshing)
              return reject(errRefreshing);

            return resolve(this.axios(config));
          });
        });
      },
    );
  },
};

axiosRetry(httpClient.axios, { retries: 5, retryDelay: retryCount => retryCount * 400 });

export default httpClient;

export const useHttp = () => httpClient;
