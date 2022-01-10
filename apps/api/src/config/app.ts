import { Environment } from '@intake24/common/types';

export type Site = 'base' | 'admin' | 'survey' | 'images' | 'docs';
export type SiteUrls = Record<Site, string>;

export type AppConfig = {
  env: Environment;
  name: string;
  host: string;
  port: number;

  secret: string;

  urls: SiteUrls;
};

const host = 'localhost';
const port = 3100;
const domain = `http://${host}:${port}`;

const appConfig: AppConfig = {
  env: (process.env.NODE_ENV || 'development') as Environment,
  name: process.env.APP_NAME || 'Intake24',
  host: process.env.APP_HOST || host,
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : port,

  secret: process.env.APP_SECRET || '',

  urls: {
    base: process.env.APP_URL_BASE || domain,
    admin: process.env.APP_URL_ADMIN || '/admin',
    survey: process.env.APP_URL_SURVEY || '/survey',
    images: process.env.APP_URL_IMAGES || `${domain}/images`,
    docs: process.env.APP_URL_DOCS || '/docs',
  },
};

export default appConfig;
