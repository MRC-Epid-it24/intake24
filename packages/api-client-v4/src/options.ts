import process from 'process';

import type { CredentialsV4 } from './credentials';

export interface ApiClientOptionsV4 {
  apiBaseUrl: string;
  credentials?: CredentialsV4 | undefined;
  refreshToken?: string | undefined;
  maxConcurrentRequests?: number | undefined;
  requestRateLimit?: number | undefined;
  requestRateLimitWindow?: number | undefined;
  cookieName?: string | undefined;
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`Required environment variable ${key} is missing.`);
  }

  return value;
}

export function getApiClientV4EnvOptions(): ApiClientOptionsV4 {
  let credentials: CredentialsV4 | undefined;

  const email = process.env['V4_API_EMAIL'];
  const password = process.env['V4_API_PASSWORD'];

  if (email !== undefined && password !== undefined) {
    credentials = {
      email,
      password,
    };
  }

  const apiBaseUrl = getRequiredEnv('V4_API_BASE_URL');
  const cookieName = process.env['V4_API_COOKIE_NAME'];
  const refreshToken = process.env['V4_API_REFRESH_TOKEN'];

  const maxConcurrentRequestsEnv = process.env['V4_API_MAX_CONCURRENT_REQUESTS'];
  const maxConcurrentRequests =
    maxConcurrentRequestsEnv !== undefined ? parseInt(maxConcurrentRequestsEnv) : undefined;

  const requestRateLimitEnv = process.env['V4_API_REQUEST_RATE_LIMIT'];
  const requestRateLimit =
    requestRateLimitEnv !== undefined ? parseInt(requestRateLimitEnv) : undefined;

  const requestRateLimitWindowEnv = process.env['V4_API_REQUEST_RATE_LIMIT_WINDOW'];
  const requestRateLimitWindow =
    requestRateLimitWindowEnv !== undefined ? parseInt(requestRateLimitWindowEnv) : undefined;

  return {
    apiBaseUrl,
    credentials,
    refreshToken,
    cookieName,
    maxConcurrentRequests,
    requestRateLimit,
    requestRateLimitWindow,
  };
}
