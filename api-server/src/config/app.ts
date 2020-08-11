export type Environment = 'development' | 'test' | 'production';

export type AppConfig = {
  env: Environment;
  name: string;
  host: string;
  port: number;
};

const appConfig: AppConfig = {
  env: (process.env.NODE_ENV ?? 'development') as Environment,
  name: process.env.APP_NAME ?? 'Intake24',
  host: process.env.APP_HOST ?? 'localhost',
  port: parseInt(process.env.APP_PORT ?? '3100', 10),
};

export default appConfig;
