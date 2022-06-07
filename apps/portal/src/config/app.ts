import type { Environment } from '@intake24/common/types';

export type AppConfig = {
  env: Environment;
  name: string;
  host: string;
  port: number;

  public: string;

  site: any;
};

const appConfig: AppConfig = {
  env: (process.env.NODE_ENV || 'development') as Environment,
  name: process.env.APP_NAME || 'Intake24 Portal',
  host: process.env.APP_HOST || 'localhost',
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3400,

  public: process.env.PUBLIC_DIR || 'public',

  site: {
    enable: process.env.SERVER_SITE_ENABLED === 'true',
    content: process.env.SERVER_SITE_CONTENT || '',
    demoURL: `${process.env.SERVER_APP_NAMESPACE}/demo?genUser`,
    videoURL: process.env.SERVER_SITE_VIDEO || '',
    support: {
      email: '',
      phone: '',
    },
  },
};

export default appConfig;
