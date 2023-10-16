import process from 'process';

import type { CredentialsV4 } from './credentials';

export interface ApiClientOptionsV4 {
  apiBaseUrl: string;
  credentials?: CredentialsV4 | undefined;
  refreshToken?: string | undefined;
  maxConcurrentRequests?: number | undefined;
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
  const refreshToken = process.env['V4_API_REFRESH_TOKEN'];
  const maxConcurrentRequestsEnv = process.env['V4_API_MAX_CONCURRENT_REQUESTS'];
  const maxConcurrentRequests =
    maxConcurrentRequestsEnv !== undefined ? parseInt(maxConcurrentRequestsEnv) : undefined;

  return {
    apiBaseUrl,
    credentials,
    refreshToken,
    maxConcurrentRequests,
  };
}
