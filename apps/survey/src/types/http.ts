import { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import Router from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/types/vuex';

export type SubscribeCallback = (err?: AxiosError) => void;

export interface HttpRequestConfig<T = any> extends AxiosRequestConfig<T> {
  withErr?: boolean;
}

export interface HttpClient {
  axios: AxiosInstance;
  init(router: Router, store: Store<RootState>): void;
  get<T = any, R = AxiosResponse<T>>(url: string, config?: HttpRequestConfig): Promise<R>;
  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<R>;
  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<R>;
  patch<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<R>;
  delete<T = any, R = AxiosResponse<T>>(url: string, config?: HttpRequestConfig): Promise<R>;
  request<T = any, R = AxiosResponse<T>>(
    url: string,
    method: Method,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<R>;
  mountInterceptors(router: Router, store: Store<RootState>): void;
  mountBearerInterceptor(store: Store<RootState>): void;
  mount401Interceptor(router: Router, store: Store<RootState>): void;
}
