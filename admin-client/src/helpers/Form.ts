import { Method } from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import { AnyDictionary } from '@common/types/common';
import { HttpRequestConfig, HttpError } from '@/types/http';
import http from '@/services/http.service';
import store from '@/store';
import Errors from './Errors';

export interface FormConfig {
  status?: string;
  multipart?: boolean;
  resetOnSubmit?: boolean;
  [key: string]: any;
}

class Form {
  originalData: AnyDictionary;

  originalKeys: string[];

  errors: Errors;

  config: FormConfig;

  [key: string]: any;

  constructor(data: AnyDictionary, config: FormConfig = {}) {
    this.originalData = cloneDeep(data);
    this.originalKeys = Object.keys(data);

    this.errors = new Errors();

    this.config = {
      multipart: false,
      resetOnSubmit: true,
      ...config,
    };

    this.assign(data);
  }

  assign(source: AnyDictionary): AnyDictionary {
    return this.assignTo(this, source);
  }

  assignTo(target: AnyDictionary, source: AnyDictionary): AnyDictionary {
    const obj = target;

    this.originalKeys.forEach((key) => {
      if (typeof source[key] === 'undefined') {
        obj[key] = this.originalData[key];
        return;
      }

      if (Object.prototype.toString.call(this.originalData[key]) === '[object Object]') {
        if (source[key] === null) obj[key] = { ...this.originalData[key] };
        else {
          const keys = Object.keys(this.originalData[key]);
          obj[key] = keys.length ? pick(source[key], keys) : { ...source[key] };
        }

        return;
      }

      obj[key] = source[key];
    });

    return obj;
  }

  update(source: AnyDictionary): void {
    this.originalKeys.forEach((key) => {
      if (!(key in source)) return;

      if (Object.prototype.toString.call(this.originalData[key]) === '[object Object]') {
        const keys = Object.keys(this.originalData[key]);
        this[key] = keys.length ? pick(source[key], keys) : { ...source[key] };
        return;
      }

      this[key] = source[key];
    });
  }

  // eslint-disable-next-line consistent-return
  settings(field: string, value?: any) {
    if (typeof value === 'undefined') return this.config[field];

    this.config[field] = value;
  }

  data(): AnyDictionary | FormData {
    if (this.settings('multipart') === false) return this.assignTo({}, this);

    const data = new FormData();

    this.originalKeys.forEach((key) => {
      if (Array.isArray(this[key])) {
        this[key].forEach((value: string) => data.append(key, value ?? ''));
      } else data.append(key, this[key] ?? '');
    });

    return data;
  }

  load(data: AnyDictionary): void {
    this.reset();
    this.assign(cloneDeep(data));
  }

  hasErrors(): boolean {
    return this.errors.any();
  }

  reset(): void {
    this.assign(this.originalData);
    this.errors.clear();
  }

  async post<T>(url: string, config: HttpRequestConfig = {}): Promise<T> {
    return this.submit<T>(url, 'post', config);
  }

  async get<T>(url: string): Promise<T> {
    return this.submit<T>(url, 'get');
  }

  async patch<T>(url: string): Promise<T> {
    return this.submit<T>(url, 'patch');
  }

  async put<T>(url: string): Promise<T> {
    return this.submit<T>(url, 'put');
  }

  async submit<T>(url: string, method: Method, config: HttpRequestConfig = {}): Promise<T> {
    const { withErr, ...rest } = config;
    const loadStr = `form-${url}`;
    store.commit('loading/add', loadStr);

    return new Promise((resolve, reject) => {
      const formData = this.data();

      http
        .request<T>(url, method, formData, { withErr: true, ...rest })
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
  }

  onSuccess(): void {
    if (this.settings('resetOnSubmit') === true) this.reset();
  }

  onFail(err: HttpError): void {
    const { response: { status, data = {} } = {} } = err;
    if (status === 422 && 'errors' in data) this.errors.record(data.errors);
  }
}

export default Form;
