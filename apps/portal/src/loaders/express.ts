import type { Express } from 'express';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import { resolve } from 'node:path';
import { httpLogger as stream } from '@intake24/services';
import type { Ops } from '../app';

export default async (app: Express, { config }: Ops): Promise<void> => {
  const {
    app: { env, public: publicPath },
  } = config;
  const isDev = env === 'development';

  // Http logger
  app.use(morgan(isDev ? 'dev' : 'combined', { stream }));

  // Templates
  nunjucks.configure([resolve(publicPath), resolve('resources/views')], {
    autoescape: true,
    express: app,
    noCache: isDev,
  });
};
