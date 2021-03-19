export type Environment = 'development' | 'test' | 'production';

export type Site = 'admin' | 'survey' | 'images' | 'docs';
export type SiteUrls = Record<Site, string>;

export type AppConfig = {
  env: Environment;
  name: string;
  host: string;
  port: number;

  urls: SiteUrls;
};

const appConfig: AppConfig = {
  env: (process.env.NODE_ENV ?? 'development') as Environment,
  name: process.env.APP_NAME ?? 'Intake24',
  host: process.env.APP_HOST ?? 'localhost',
  port: parseInt(process.env.APP_PORT ?? '3100', 10),

  urls: {
    admin: process.env.APP_URL_ADMIN ?? '/admin',
    survey: process.env.APP_URL_SURVEY ?? '/survey',
    images: process.env.APP_URL_IMAGES ?? 'http://localhost:3100/images',
    docs: process.env.APP_URL_DOCS ?? '/docs',
  },
};

export default appConfig;
