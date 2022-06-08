import { logConfig as log, LogConfig, mailConfig as mail, MailConfig } from '@intake24/services';
import app, { AppConfig } from './app';
import filesystem, { FileSystemConfig } from './filesystem';
import site, { SiteConfig } from './site';

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
