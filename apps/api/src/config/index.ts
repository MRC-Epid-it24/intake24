import acl, { ACLConfig } from './acl';
import app, { AppConfig } from './app';
import cache, { CacheConfig } from './cache';
import database, { DatabaseConfig } from './database';
import filesystem, { FileSystemConfig } from './filesystem';
import log, { LogConfig } from './log';
import mail, { MailConfig } from './mail';
import queue, { QueueConfig } from './queue';
import security, { SecurityConfig } from './security';
import services, { ServicesConfig } from './services';
import session, { SessionConfig } from './session';

export * from './acl';
export * from './app';
export * from './cache';
export * from './database';
export * from './filesystem';
export * from './log';
export * from './mail';
export * from './queue';
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
  security,
  services,
  session,
};

export default config;
