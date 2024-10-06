import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { useRouter } from 'vue-router';

export type Router = ReturnType<typeof useRouter>;

export type SubscribeCallback = (err?: AxiosError) => void;

export interface HttpRequestConfig<D = any> extends AxiosRequestConfig<D> {
  withLoading?: boolean;
}

export interface HttpClient {
  axios: AxiosInstance;
  // TODO: authStore should be authentication store, but they differ a bit between admin & survey -> would need common interface defined
  init: (router: Router, authStore: any) => void;
  mountInterceptors: (router: Router, authStore: any) => void;
  mountBearerInterceptor: (authStore: any) => void;
  mount401Interceptor: (router: Router, authStore: any) => void;
  get: <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: HttpRequestConfig<D>
  ) => Promise<R>;
  post: <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: HttpRequestConfig<D>
  ) => Promise<R>;
  put: <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: HttpRequestConfig<D>
  ) => Promise<R>;
  patch: <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: HttpRequestConfig<D>
  ) => Promise<R>;
  delete: <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: HttpRequestConfig<D>
  ) => Promise<R>;
  request: <T = any, R = AxiosResponse<T>, D = any>(config: HttpRequestConfig<D>) => Promise<R>;
}
