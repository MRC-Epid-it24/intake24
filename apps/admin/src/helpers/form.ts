import { AxiosError } from 'axios';
import pick from 'lodash/pick';
import { serialize } from 'object-to-formdata';
import type { Dictionary } from '@intake24/common/types';
import { copy, merge, Errors, getObjectNestedKeys } from '@intake24/common/util';
import { httpService } from '@intake24/admin/services';
import type { HttpRequestConfig } from '@intake24/ui/types/http';
import { useLoading } from '../stores';

export interface FormConfig<T> {
  status?: string;
  multipart?: boolean;
  resetOnSubmit?: boolean;
  extractNestedKeys?: boolean;
  transform?: (data: T) => any;
}

export interface FormDef<T = Dictionary> {
  data: T;
  initData: T;
  keys: (keyof T)[];
  allKeys: string[];
  errors: Errors;
  config: FormConfig<T>;
  assign(source: Dictionary): void;
  load(input: Dictionary): void;
  hasErrors(): boolean;
  reset(): void;
  getData(object?: boolean): T | FormData;
  submit<R>(config: HttpRequestConfig): Promise<R>;
  post<R>(url: string, config?: HttpRequestConfig): Promise<R>;
  get<R>(url: string, config?: HttpRequestConfig): Promise<R>;
  patch<R>(url: string, config?: HttpRequestConfig): Promise<R>;
  put<R>(url: string, config?: HttpRequestConfig): Promise<R>;
  onSuccess(): void;
  onFail(err: AxiosError): void;
}

export type FormFields<T = Dictionary> = { [P in keyof T]: T[P] };

export type Form<T = Dictionary> = FormDef<T> & FormFields<T>;

export default <T = Dictionary>(initData: T, formConfig: FormConfig<T> = {}): Form<T> => {
  const keys = Object.keys(initData) as (keyof T)[];
  const allKeys = formConfig.extractNestedKeys
    ? getObjectNestedKeys(initData)
    : ([...keys] as string[]);

  const formDef: FormDef<T> = {
    data: copy(initData),
    initData,
    keys,
    allKeys,
    errors: new Errors(),
    config: {
      multipart: false,
      resetOnSubmit: true,
      ...formConfig,
    },
    assign<S extends T>(source: S): void {
      this.data = merge(this.data, pick(source, allKeys));
    },

    load<S extends T>(source: S): void {
      this.reset();
      this.assign(source);
    },

    hasErrors(): boolean {
      return this.errors.any();
    },

    reset(): void {
      this.errors.clear();
      this.data = copy(this.initData);
    },

    getData(object = false): T | FormData {
      if (object) return this.data;

      return this.config.multipart ? serialize<T>(this.data) : this.data;
    },

    async submit<R>(config: HttpRequestConfig): Promise<R> {
      const { withErr, ...rest } = config;
      const loadStr = `form-${config.url}`;
      const loading = useLoading();
      loading.addItem(loadStr);

      const { transform } = this.config;
      const output =
        transform && !this.config.multipart ? transform(this.getData() as T) : this.getData();

      return new Promise((resolve, reject) => {
        httpService
          .request<R>({ data: output, withErr: true, ...rest })
          .then((res) => {
            const { data } = res;
            this.onSuccess();
            resolve(data);
          })
          .catch((err) => {
            this.onFail(err);

            if (withErr) reject(err.response.data);
          })
          .finally(() => {
            loading.removeItem(loadStr);
          });
      });
    },

    async post<R>(url: string, config?: HttpRequestConfig): Promise<R> {
      return this.submit<R>({ url, method: 'post', ...config });
    },

    async get<R>(url: string, config?: HttpRequestConfig): Promise<R> {
      return this.submit<R>({ url, method: 'get', ...config });
    },

    async patch<R>(url: string, config?: HttpRequestConfig): Promise<R> {
      console.log(config);
      return this.submit<R>({ url, method: 'patch', ...config });
    },

    async put<R>(url: string, config?: HttpRequestConfig): Promise<R> {
      return this.submit<R>({ url, method: 'put', ...config });
    },

    onSuccess(): void {
      if (this.config.resetOnSubmit === true) this.reset();
    },

    onFail(err: AxiosError<any>): void {
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
