import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import trim from 'lodash/trim';
import type { HttpClient, HttpRequestConfig, SubscribeCallback } from '@intake24/ui/types';
import type { AuthStoreDef } from '../stores';
import { useLoading, useMessages } from '../stores';
import { randomString } from '@intake24/common/util';

let isRefreshing = false;
let tokenSubscribers: SubscribeCallback[] = [];

const subscribeTokenRefresh = (cb: SubscribeCallback) => tokenSubscribers.push(cb);

const onTokenRefreshed = (errRefreshing?: AxiosError) =>
  tokenSubscribers.map((cb) => cb(errRefreshing));

const httpClient: HttpClient = {
  axios: axios.create({
    baseURL: [import.meta.env.VITE_APP_API_HOST, import.meta.env.VITE_APP_API_URL]
      .map((item) => trim(item, '/'))
      .join('/'),
    // @ts-expect-error: Axios typings issue, remove when fixed
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
    const { withErr, withLoading, ...rest } = config;

    const loading = useLoading();
    const loadingId = `request-${randomString(6)}`;
    if (withLoading) loading.addItem(loadingId);

    try {
      const res = await this.axios.request<T, R, D>(rest);
      return res;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { response } = err as AxiosError<T, D>;
        if (response && ![401, 404, 422].includes(response.status)) {
          const {
            data: { message },
          } = response;
          useMessages().error(message ?? err.message);
        }
      }

      throw err;
    } finally {
      if (withLoading) loading.removeItem(loadingId);
    }
  },

  mountInterceptors(router, useAuth: AuthStoreDef) {
    this.mountBearerInterceptor(useAuth);
    this.mount401Interceptor(router, useAuth);
  },

  mountBearerInterceptor(useAuth: AuthStoreDef) {
    this.axios.interceptors.request.use((request) => {
      const { accessToken } = useAuth();

      if (accessToken) {
        const { headers = {} } = request;
        // eslint-disable-next-line no-param-reassign
        request.headers = { ...headers, Authorization: `Bearer ${accessToken}` };
      }

      return request;
    });
  },

  mount401Interceptor(router, useAuth: AuthStoreDef) {
    const auth = useAuth();

    this.axios.interceptors.response.use(
      (response) => response,
      async (err: AxiosError) => {
        const { config = {}, response: { status } = {} } = err;
        const origRequest = config;

        // Exclude non-401s and sign-in 401s (/login)
        if (status !== 401 || config.url?.includes('auth/login')) return Promise.reject(err);

        // Refresh token has failed. Logout the user
        if (config.url?.includes('auth/refresh')) {
          isRefreshing = false;

          await auth.logout();
          if (router.currentRoute.name !== 'login') router.push({ name: 'login' });

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

        const initTokenSubscriber = new Promise((resolve, reject) => {
          subscribeTokenRefresh((errRefreshing) => {
            if (errRefreshing) return reject(errRefreshing);

            return resolve(this.axios(origRequest));
          });
        });
        return initTokenSubscriber;
      }
    );
  },
};

export default httpClient;
