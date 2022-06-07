import { logConfig as log, LogConfig } from '@intake24/services';
import app, { AppConfig } from './app';
import site, { SiteConfig } from './site';

export * from './app';

export type Config = {
  app: AppConfig;
  log: LogConfig;
  site: SiteConfig;
};

const config: Config = {
  app,
  log,
  site,
};

export default config;
