import type { Express } from 'express';
import morgan from 'morgan';
import { FileSystemLoader, Environment } from 'nunjucks';
import { resolve } from 'node:path';
import { httpLogger as stream } from '@intake24/services';
import type { Ops } from '../app';
import { mix } from '../util';

export default async (app: Express, { config }: Ops): Promise<void> => {
  const {
    app: { env },
    filesystem: { local },
  } = config;
  const isDev = env === 'development';

  // Http logger
  app.use(morgan(isDev ? 'dev' : 'combined', { stream }));

  // Templates
  const nunjucksFileLoader = new FileSystemLoader(
    [resolve(local.public), resolve('resources/views')],
    { noCache: isDev }
  );

  const nunjucksEnv = new Environment(nunjucksFileLoader, {
    autoescape: true,
    web: { useCache: !isDev },
  });

  nunjucksEnv.express(app);
  nunjucksEnv.addGlobal('mix', mix);

  app.engine('njk', nunjucksEnv.render);
  app.set('view engine', 'njk');
};
