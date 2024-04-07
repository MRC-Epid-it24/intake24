import type { Environment } from '@intake24/common/types';

export type AppConfig = {
  env: Environment;
  name: string;
  host: string;
  port: number;
};

const appConfig: AppConfig = {
  env: (process.env.NODE_ENV || 'development') as Environment,
  name: process.env.APP_NAME || 'Intake24 Portal',
  host: process.env.APP_HOST || 'localhost',
  port: process.env.APP_PORT ? Number.parseInt(process.env.APP_PORT, 10) : 3400,
};

export default appConfig;
