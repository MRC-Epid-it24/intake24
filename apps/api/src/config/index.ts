import { databaseConfig as database, DatabaseConfig } from '@intake24/db';
import { logConfig as log, LogConfig, mailConfig as mail, MailConfig } from '@intake24/services';
import acl, { ACLConfig } from './acl';
import app, { AppConfig } from './app';
import cache, { CacheConfig } from './cache';
import filesystem, { FileSystemConfig } from './filesystem';
import queue, { QueueConfig } from './queue';
import rateLimiter, { RateLimiterConfig } from './rate-limiter';
import security, { SecurityConfig } from './security';
import services, { ServicesConfig } from './services';
import session, { SessionConfig } from './session';

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
