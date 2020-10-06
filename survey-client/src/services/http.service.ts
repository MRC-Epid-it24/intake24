import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { HttpClient, HttpRequestConfig, SubscribeCallback } from '@/types/http';
import tokenSvc from './token.service';

let isRefreshing = false;
let tokenSubscribers: SubscribeCallback[] = [];

const subscribeTokenRefresh = (cb: SubscribeCallback) => tokenSubscribers.push(cb);

const onTokenRefreshed = (errRefreshing?: AxiosError) =>
  tokenSubscribers.map((cb) => cb(errRefreshing));

const httpClient: HttpClient = {
  axios,

  init(baseURL: string) {
    this.axios.defaults.baseURL = baseURL;
    // this.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    this.axios.defaults.withCredentials = true;

    this.mountBearerInterceptor();
  },

  async get(url: string, config: HttpRequestConfig = {}) {
    return this.request(url, 'get', {}, config);
  },

  async post(url: string, data = {}, config: HttpRequestConfig = {}) {
    return this.request(url, 'post', data, config);
  },

  async put(url: string, data = {}, config: HttpRequestConfig = {}) {
    return this.request(url, 'put', data, config);
  },

  async patch(url: string, data = {}, config: HttpRequestConfig = {}) {
    return this.request(url, 'patch', data, config);
  },

  async delete(url: string, config: HttpRequestConfig = {}) {
    return this.request(url, 'delete', {}, config);
  },

  async request<T = any, R = AxiosResponse<T>>(
    url: string,
    method: Method,
    data = {},
    config: HttpRequestConfig = {}
  ): Promise<R> {
    // const { withErr, ...rest } = config;

    return new Promise((resolve, reject) => {
      this.axios
        .request<T, R>({
          url,
          method,
          data,
          ...config,
        })
        .then((res) => resolve(res))
        .catch((err) => {
          /* const { response } = err;
          if (response && ![401, 422].includes(response.status)) {
            const {
              data: { message },
            } = response;
            Vue.toasted.error(message ?? err.message);
          } */

          return reject(err);
        });
    });
  },

  mountBearerInterceptor() {
    this.axios.interceptors.request.use((request) => {
      const accessToken = tokenSvc.getAccessToken();

      // eslint-disable-next-line no-param-reassign
      if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`;

      return request;
    });
  },

  mount401Interceptor(router, store) {
    this.axios.interceptors.response.use(
      (response) => response,
      async (err: AxiosError) => {
        const { config = {}, response: { status } = {} } = err;
        const origRequest = config;

        // Exclude non-401s and sign-in 401s (/login/alias and /login/token/:token)
        if (status !== 401 || config.url?.includes('login')) return Promise.reject(err);

        // Refresh token has failed. Logout the user
        if (config.url?.includes('refresh')) {
          isRefreshing = false;

          await store.dispatch('auth/logout');
          const { name, params: { surveyId } = {} } = router.currentRoute;
          if (surveyId && name !== 'login') router.push({ name: 'login', params: { surveyId } });
          return Promise.reject(err);
        }

        if (!isRefreshing) {
          isRefreshing = true;

          store
            .dispatch('auth/refresh')
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
