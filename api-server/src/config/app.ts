export type Environment = 'development' | 'test' | 'production';

export type AppConfig = {
  env: Environment;
  name: string;
  host: string;
  port: number;

  urls: {
    admin: string;
    docs: string;
    survey: string;
  };
};

const appConfig: AppConfig = {
  env: (process.env.NODE_ENV ?? 'development') as Environment,
  name: process.env.APP_NAME ?? 'Intake24',
  host: process.env.APP_HOST ?? 'localhost',
  port: parseInt(process.env.APP_PORT ?? '3100', 10),

  urls: {
    admin: process.env.APP_URL_ADMIN ?? '/admin',
    docs: process.env.APP_URL_DOCS ?? '/docs',
    survey: process.env.APP_URL_SURVEY ?? '/survey',
  },
};

export default appConfig;
