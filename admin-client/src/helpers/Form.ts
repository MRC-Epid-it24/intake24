import { Method } from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import mergeWith from 'lodash/mergeWith';
import pick from 'lodash/pick';
import { serialize } from 'object-to-formdata';
import http from '@/services/http.service';
import store from '@/store';
import type { Dictionary } from '@common/types';
import type { HttpRequestConfig, HttpError } from '@/types/http';
import Errors from './Errors';

export interface FormConfig {
  status?: string;
  multipart?: boolean;
  resetOnSubmit?: boolean;
}

export interface FormDef<T = Dictionary> {
  data: T;
  initData: T;
  keys: (keyof T)[];
  errors: Errors;
  config: FormConfig;
  assign(source: Dictionary): void;
  load(input: Dictionary): void;
  hasErrors(): boolean;
  reset(): void;
  getData(): T | FormData;
  submit<R>(url: string, method: Method, config?: HttpRequestConfig): Promise<R>;
  post<R>(url: string, config?: HttpRequestConfig): Promise<R>;
  get<R>(url: string): Promise<R>;
  patch<R>(url: string): Promise<R>;
  put<R>(url: string): Promise<R>;
  onSuccess(): void;
  onFail(err: HttpError): void;
}

export type FormFields<T = Dictionary> = { [P in keyof T]: T[P] };

export type Form<T = Dictionary> = FormDef<T> & FormFields<T>;

export default <T = Dictionary>(initData: T, formConfig: FormConfig = {}): Form<T> => {
  const keys = Object.keys(initData) as (keyof T)[];

  const formDef: FormDef<T> = {
    data: cloneDeep(initData),
    initData,
    keys,
    errors: new Errors(),
    config: {
      multipart: false,
      resetOnSubmit: true,
      ...formConfig,
    },
    assign(source: Dictionary): void {
      const picked = pick(source, this.keys);

      mergeWith(this.data, picked, (objValue, srcValue) =>
        Array.isArray(objValue) ? srcValue : undefined
      );
    },

    load(input: Dictionary): void {
      this.reset();
      this.assign(input);
    },

    hasErrors(): boolean {
      return this.errors.any();
    },

    reset(): void {
      this.errors.clear();
      this.data = cloneDeep(this.initData);
    },

    getData(): T | FormData {
      return this.config.multipart ? serialize<T>(this.data) : this.data;
    },

    async submit<R>(url: string, method: Method, config: HttpRequestConfig = {}): Promise<R> {
      const { withErr, ...rest } = config;
      const loadStr = `form-${url}`;
      store.commit('loading/add', loadStr);

      return new Promise((resolve, reject) => {
        http
          .request<R>(url, method, this.getData(), { withErr: true, ...rest })
          .then((res) => {
            const { data } = res;
            this.onSuccess();
            resolve(data);
          })
          .catch((err) => {
            this.onFail(err);

            if (withErr) reject(err.response.data);
          })
          .finally(() => store.commit('loading/remove', loadStr));
      });
    },

    async post<R>(url: string, config: HttpRequestConfig = {}): Promise<R> {
      return this.submit<R>(url, 'post', config);
    },

    async get<R>(url: string): Promise<R> {
      return this.submit<R>(url, 'get');
    },

    async patch<R>(url: string): Promise<R> {
      return this.submit<R>(url, 'patch');
    },

    async put<R>(url: string): Promise<R> {
      return this.submit<R>(url, 'put');
    },

    onSuccess(): void {
      if (this.config.resetOnSubmit === true) this.reset();
    },

    onFail(err: HttpError): void {
      const { response: { status, data = {} } = {} } = err;
      if (status === 422 && 'errors' in data) this.errors.record(data.errors);
    },
  };

  const formFields: any = {};

  for (const key of keys) {
    Object.defineProperty(formFields, key, {
      get: () => formFields.data[key],
      set: (value: any) => {
        if (formFields.data[key] === value) return;

        formFields.data[key] = value;
      },
    });
  }

  return Object.assign(formFields, formDef);
};
