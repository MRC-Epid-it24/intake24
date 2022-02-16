import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import redisStore from 'connect-redis';
import { Express } from 'express';
import expressSession from 'express-session';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import path from 'path';
import type { Ops } from '@intake24/api/app';
import ioc from '@intake24/api/ioc';
import { httpLogger as stream } from '@intake24/services';

export default async (app: Express, { config }: Ops): Promise<void> => {
  const {
    app: { env, secret },
    session: { cookie },
  } = config;

  const isDev = env === 'development';

  if (!secret) throw new Error('Application secret not set.');

  // Body parser
  app.use(json());
  app.use(urlencoded({ extended: false }));

  // Cookie parser
  app.use(cookieParser(secret));

  // Http logger
  app.use(morgan(isDev ? 'dev' : 'combined', { stream }));

  // Session store + middleware
  const client = ioc.cradle.session.init();
  const RedisStore = redisStore(expressSession);

  app.use(
    expressSession({
      store: new RedisStore({ client, prefix: '', ttl: cookie.maxAge / 1000 }),
      name: cookie.name,
      cookie,
      saveUninitialized: true,
      secret,
      resave: false,
    })
  );

  // Templates
  nunjucks.configure([path.resolve('public'), path.resolve('resources/views')], {
    autoescape: true,
    express: app,
    noCache: isDev,
  });
};
