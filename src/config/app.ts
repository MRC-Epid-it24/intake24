interface AppConfig {
  env: string;
  name: string;
  port: number;
  url: string;
}

const appConfig: AppConfig = {
  env: process.env.NODE_ENV ?? 'development',
  name: process.env.APP_NAME ?? 'Intake24 API Server',
  port: parseInt(process.env.APP_PORT ?? '3100', 10),
  url: process.env.APP_URL ?? 'localhost',
};

export default appConfig;
