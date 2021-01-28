import { AxiosRequestConfig, AxiosError, AxiosResponse, AxiosStatic, Method } from 'axios';
import Router from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/types/vuex';

export type SubscribeCallback = (err?: AxiosError) => void;

export interface HttpRequestConfig extends AxiosRequestConfig {
  withErr?: boolean;
}

export interface HttpResponseData {
  message?: string;
  [key: string]: any;
}

export type HttpError = AxiosError<HttpResponseData>;
export type HttpResponse = AxiosResponse<HttpResponseData>;

export interface HttpClient {
  axios: AxiosStatic;
  init(baseURL: string): void;
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
  mountBearerInterceptor(): void;
  mount401Interceptor(router: Router, store: Store<RootState>): void;
}
