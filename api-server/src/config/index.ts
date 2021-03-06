import acl, { ACLConfig } from './acl';
import app, { AppConfig } from './app';
import database, { DatabaseConfig } from './database';
import filesystem, { FileSystemConfig } from './filesystem';
import mail, { MailConfig } from './mail';
import queue, { QueueConfig } from './queue';
import security, { SecurityConfig } from './security';
import services, { ServicesConfig } from './services';

export * from './acl';
export * from './app';
export * from './database';
export * from './filesystem';
export * from './mail';
export * from './queue';
export * from './security';
export * from './services';

export type Config = {
  acl: ACLConfig;
  app: AppConfig;
  database: DatabaseConfig;
  filesystem: FileSystemConfig;
  mail: MailConfig;
  queue: QueueConfig;
  security: SecurityConfig;
  services: ServicesConfig;
};

export default {
  acl,
  app,
  database,
  filesystem,
  mail,
  queue,
  security,
  services,
};
