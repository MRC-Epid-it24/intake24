import type { DatabaseConfig } from '@intake24/db';
import type { LogConfig, MailConfig } from '@intake24/services';
import { databaseConfig as database } from '@intake24/db';
import { logConfig as log, mailConfig as mail } from '@intake24/services';

import type { ACLConfig } from './acl';
import type { AppConfig } from './app';
import type { CacheConfig } from './cache';
import type { FileSystemConfig } from './filesystem';
import type { QueueConfig } from './queue';
import type { RateLimiterConfig } from './rate-limiter';
import type { SecurityConfig } from './security';
import type { ServicesConfig } from './services';
import type { SessionConfig } from './session';
import acl from './acl';
import app from './app';
import cache from './cache';
import filesystem from './filesystem';
import queue from './queue';
import rateLimiter from './rate-limiter';
import security from './security';
import services from './services';
import session from './session';

export * from './acl';
export * from './app';
export * from './cache';
export * from './filesystem';
export * from './queue';
export * from './rate-limiter';
export * from './security';
export * from './services';
export * from './session';

export type Config = {
  acl: ACLConfig;
  app: AppConfig;
  cache: CacheConfig;
  database: DatabaseConfig;
  filesystem: FileSystemConfig;
  log: LogConfig;
  mail: MailConfig;
  queue: QueueConfig;
  rateLimiter: RateLimiterConfig;
  security: SecurityConfig;
  services: ServicesConfig;
  session: SessionConfig;
};

const config: Config = {
  acl,
  app,
  cache,
  database,
  filesystem,
  log,
  mail,
  queue,
  rateLimiter,
  security,
  services,
  session,
};

export default config;
