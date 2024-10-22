import type { Express } from 'express';

import type { Ops } from '../app';
import { resolve } from 'node:path';
import morgan from 'morgan';

import { Environment, FileSystemLoader } from 'nunjucks';

import { httpLogger as stream } from '@intake24/common-backend';
import { vite } from '../util';

export default (app: Express, { config }: Ops) => {
  const {
    app: { env },
    filesystem: { local },
    site,
  } = config;
  const isDev = env === 'development';

  // Http logger
  app.use(morgan(isDev ? 'dev' : 'combined', { stream }));

  // Templates
  const nunjucksFileLoader = new FileSystemLoader(
    [resolve(local.public), resolve('resources/views')],
    { noCache: isDev },
  );

  const nunjucksEnv = new Environment(nunjucksFileLoader, {
    autoescape: true,
    web: { useCache: !isDev },
  });

  nunjucksEnv.express(app);
  nunjucksEnv
    .addGlobal('vite', vite)
    .addGlobal('site', site)
    .addGlobal('year', new Date().getFullYear());

  app.engine('njk', nunjucksEnv.render);
  app.set('view engine', 'njk');

  app.disable('x-powered-by');
};
