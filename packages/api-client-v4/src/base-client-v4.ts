import type { AxiosResponse } from 'axios';
import type { Logger } from 'winston';
import axios, { Axios, HttpStatusCode } from 'axios';
import { parse as parseCookie, serialize as serializeCookie } from 'cookie';
import fs from 'fs';
import pLimit from 'p-limit';

import type { LoginResponse, RefreshResponse } from '@intake24/common/types/http';

import type { CredentialsV4 } from './credentials';
import type { ApiClientOptionsV4 } from './options';

const REFRESH_TOKEN_COOKIE_NAME = 'it24s_refresh_token';
const DEFAULT_MAX_CONCURRENT_REQUESTS = 10;

export class BaseClientV4 {
  private apiBaseUrl: string;

  private credentials?: CredentialsV4;
  private refreshToken?: string;
  private accessToken?: string;

  public readonly logger: Logger;
  public readonly rawClient: Axios;
  public readonly accessClient: Axios;

  private readonly requestLimit;

  private loginRequest?: Promise<void>;
  private refreshRequest?: Promise<void>;

  public constructor(logger: Logger, options: ApiClientOptionsV4) {
    this.apiBaseUrl = options.apiBaseUrl;
    this.credentials = options.credentials;
    this.refreshToken = options.refreshToken;

    this.requestLimit = pLimit(options.maxConcurrentRequests ?? DEFAULT_MAX_CONCURRENT_REQUESTS);

    this.logger = logger.child({ service: 'V4 API' });

    this.rawClient = new Axios({
      ...axios.defaults,
      headers: {},
      validateStatus: null,
      baseURL: this.apiBaseUrl,
    });

    this.accessClient = new Axios({
      ...axios.defaults,
      headers: {},
      validateStatus: null,
      baseURL: this.apiBaseUrl,
    });

    this.accessClient.interceptors.request.use(
      async (config) => {
        this.logger.debug(`Access request: ${config.method} ${config.url}`);

        if (this.accessToken === undefined) {
          this.logger.debug('Access token is undefined');
          await this.refresh();
        }

        config.headers.set('Authorization', `Bearer ${this.accessToken}`);
        return config;
      },
      (error) => {
        throw error;
      }
    );

    this.accessClient.interceptors.response.use(
      async (response) => {
        if (response.status === HttpStatusCode.Unauthorized) {
          this.logger.debug(
            `Access token rejected for request: ${response.config.method} ${response.config.url}`
          );

          await this.refresh();

          const response2 = await this.requestLimit(() =>
            this.rawClient.request({
              ...response.config,
              headers: { ...response.config.headers, Authorization: `Bearer ${this.accessToken}` },
            })
          );

          if (response2.status === HttpStatusCode.Unauthorized) {
            throw new Error('Access token rejected by the API server again after refreshing.');
          }

          return response2;
        } else return response;
      },
      (error) => {
        throw error;
      }
    );
  }

  private async refreshImpl(): Promise<void> {
    this.logger.debug('Refreshing access token');

    if (this.refreshToken === undefined) {
      this.logger.debug('Refresh token is undefined');

      return this.login();
    } else {
      const response = await this.rawClient.post<RefreshResponse>('/api/auth/refresh', undefined, {
        headers: {
          Cookie: serializeCookie(REFRESH_TOKEN_COOKIE_NAME, this.refreshToken ?? ''),
        },
      });

      if (response.status === HttpStatusCode.Ok) {
        this.accessToken = response.data.accessToken;
      } else if (response.status === HttpStatusCode.Unauthorized) {
        this.logger.debug('Cached refresh token rejected by the API server. Trying to login.');

        return this.login();
      } else {
        throw new Error(`Unexpected status code: ${response.status} (${response.config.url})`);
      }
    }
  }

  private async refresh(): Promise<void> {
    if (this.refreshRequest === undefined) {
      this.refreshRequest = this.refreshImpl();
      await this.refreshRequest;
      this.refreshRequest = undefined;
    } else {
      return this.refreshRequest;
    }
  }

  private setRefreshTokenFromResponse(response: AxiosResponse): void {
    const cookies = response.headers['set-cookie'];

    if (cookies === undefined)
      throw new Error(
        `Missing Set-Cookie header: ${response.config.method} ${response.config.url}`
      );

    const refreshToken = cookies
      .map((str) => parseCookie(str)[REFRESH_TOKEN_COOKIE_NAME])
      .find((value) => value !== undefined);

    if (refreshToken === undefined)
      throw new Error(
        `Expected cookie "${REFRESH_TOKEN_COOKIE_NAME}" missing in response: ${response.config.method} ${response.config.url}`
      );

    this.refreshToken = refreshToken;
  }

  private async loginImpl(): Promise<void> {
    if (this.credentials === undefined) {
      throw new Error(
        'Cannot sign in because the Intake24 user email or password is not defined. Check for missing environment or configuration variables.'
      );
    }

    this.logger.debug('Signing in with email and password');

    const response = await this.rawClient.post<LoginResponse>('/api/auth/login', this.credentials, {
      headers: { 'Content-Type': 'application/json' },
    });

    switch (response.status) {
      case HttpStatusCode.Ok:
        this.setRefreshTokenFromResponse(response);
        this.accessToken = response.data.accessToken;
        break;
      case HttpStatusCode.Unauthorized:
        throw new Error(
          'Authentication credentials (user name and password) rejected by the API server.'
        );
      default:
        throw new Error(`Unexpected status code: ${response.status}`);
    }
  }

  private async login() {
    if (this.loginRequest === undefined) {
      this.loginRequest = this.loginImpl();
      await this.loginRequest;
      this.loginRequest = undefined;
    } else {
      return this.loginRequest;
    }
  }

  private onUnexpectedStatus(response: AxiosResponse<any>): Error {
    const message = `Unexpected status code ${response.status} for request: ${response.config.method} ${response.config.url}`;

    this.logger.error(message);

    if (response.data !== undefined) {
      this.logger.error(`Response body: ${JSON.stringify(response.data)}`);
    }

    return new Error(message);
  }

  private checkStatus<T>(response: AxiosResponse<T>, expectedStatus: number[]): void {
    if (!expectedStatus.includes(response.status)) throw this.onUnexpectedStatus(response);
  }

  private acceptNotFound<T>(response: AxiosResponse<T>): T | null {
    switch (response.status) {
      case HttpStatusCode.Ok:
        return response.data;
      case HttpStatusCode.NotFound:
        return null;
      default:
        throw this.onUnexpectedStatus(response);
    }
  }

  public async get<Res, Req = any>(
    endpoint: string,
    body?: Req,
    params?: Record<string, any>,
    expectedStatus: number[] = [HttpStatusCode.Ok]
  ): Promise<Res> {
    const response = await this.requestLimit(() =>
      this.accessClient.get<Res>(endpoint, { data: body, params })
    );
    this.checkStatus(response, expectedStatus);
    return response.data;
  }

  public async post<Res, Req = any>(
    endpoint: string,
    body?: Req,
    params?: Record<string, any>,
    expectedStatus: number[] = [HttpStatusCode.Ok, HttpStatusCode.Created, HttpStatusCode.Accepted]
  ): Promise<Res> {
    const response = await this.requestLimit(() =>
      this.accessClient.post<Res>(endpoint, body, { params })
    );
    this.checkStatus(response, expectedStatus);
    return response.data;
  }

  public async postResponse<Res, Req = any>(
    endpoint: string,
    body?: Req,
    params?: Record<string, any>
  ): Promise<AxiosResponse<Res>> {
    return await this.requestLimit(() => this.accessClient.post<Res>(endpoint, body, { params }));
  }

  public async put<Res, Req = any>(
    endpoint: string,
    body?: Req,
    params?: Record<string, any>,
    expectedStatus: number[] = [HttpStatusCode.Ok, HttpStatusCode.Accepted]
  ): Promise<Res> {
    const response = await this.requestLimit(() =>
      this.accessClient.put<Res>(endpoint, body, { params })
    );
    this.checkStatus(response, expectedStatus);
    return response.data;
  }

  public async patch<Res, Req = any>(
    endpoint: string,
    body?: Req,
    params?: Record<string, any>,
    expectedStatus: number[] = [HttpStatusCode.Ok, HttpStatusCode.Accepted]
  ): Promise<Res> {
    const response = await this.requestLimit(() =>
      this.accessClient.patch<Res>(endpoint, body, { params })
    );
    this.checkStatus(response, expectedStatus);
    return response.data;
  }

  public async getOptional<Res, Req = any>(endpoint: string, body?: Req): Promise<Res | null> {
    const response = await this.requestLimit(() =>
      this.accessClient.get<Res>(endpoint, { data: body })
    );
    this.checkStatus(response, [HttpStatusCode.Ok, HttpStatusCode.NotFound]);
    if (response.status === HttpStatusCode.NotFound) return null;
    return response.data;
  }

  public async getFile<Req = any>(endpoint: string, destPath: string, body?: Req): Promise<void> {
    const response = await this.requestLimit(() =>
      this.accessClient.get(endpoint, {
        responseType: 'stream',
      })
    );

    this.checkStatus(response, [HttpStatusCode.Ok]);

    const writer = fs.createWriteStream(destPath);

    response.data.pipe(writer); // Does this need closing?

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }
}
