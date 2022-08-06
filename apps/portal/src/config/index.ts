import type { LogConfig, MailConfig } from '@intake24/services';
import { logConfig as log, mailConfig as mail } from '@intake24/services';

import type { AppConfig } from './app';
import type { FileSystemConfig } from './filesystem';
import type { SiteConfig } from './site';
import app from './app';
import filesystem from './filesystem';
import site from './site';

export * from './app';
export * from './filesystem';
export * from './site';

export type Config = {
  app: AppConfig;
  filesystem: FileSystemConfig;
  mail: MailConfig;
  log: LogConfig;
  site: SiteConfig;
};

const config: Config = {
  app,
  filesystem,
  log,
  mail,
  site,
};

export default config;
