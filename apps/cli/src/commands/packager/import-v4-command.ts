import fs from 'fs/promises';
import * as process from 'process';

import type { CredentialsV4 } from '@intake24/api-client-v4';
import type { ConflictResolutionStrategy } from '@intake24/cli/commands/packager/importer-v4';
import { ApiClientV4 } from '@intake24/api-client-v4';
import { ImporterV4 } from '@intake24/cli/commands/packager/importer-v4';
import { logger as mainLogger } from '@intake24/common-backend/services/logger';

export interface PackageImportOptions {
  asServed?: string[];
  locale?: string[];
  onConflict?: ConflictResolutionStrategy;
}

type Logger = typeof mainLogger;

const DEFAULT_MAX_CONCURRENT_REQUESTS = 10;

function getRequiredEnv(key: string): string {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`Required environment variable ${key} is missing.`);
  }

  return value;
}

export default async (
  version: string,
  inputFilePath: string,
  options: PackageImportOptions
): Promise<void> => {
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
    maxConcurrentRequestsEnv !== undefined
      ? parseInt(maxConcurrentRequestsEnv)
      : DEFAULT_MAX_CONCURRENT_REQUESTS;

  const logger = mainLogger.child({ service: 'V4 packager' });

  const apiClient = new ApiClientV4(
    apiBaseUrl,
    logger,
    maxConcurrentRequests,
    refreshToken,
    credentials
  );

  const importer = new ImporterV4(apiClient, logger, inputFilePath, {
    onConflict: options.onConflict,
  });

  await importer.import();
};
