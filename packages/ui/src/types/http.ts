import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type Router from 'vue-router';

export type SubscribeCallback = (err?: AxiosError) => void;

export interface HttpRequestConfig<D = any> extends AxiosRequestConfig<D> {
  withLoading?: boolean;
}

export interface HttpClient {
  axios: AxiosInstance;
  init(router: Router, authStore: unknown): void;
  mountInterceptors(router: Router, authStore: unknown): void;
  mountBearerInterceptor(authStore: unknown): void;
  mount401Interceptor(router: Router, authStore: unknown): void;
  get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: HttpRequestConfig<D>
  ): Promise<R>;
  post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: HttpRequestConfig<D>
  ): Promise<R>;
  put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: HttpRequestConfig<D>
  ): Promise<R>;
  patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: HttpRequestConfig<D>
  ): Promise<R>;
  delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: HttpRequestConfig<D>
  ): Promise<R>;
  request<T = any, R = AxiosResponse<T>, D = any>(config: HttpRequestConfig<D>): Promise<R>;
}
