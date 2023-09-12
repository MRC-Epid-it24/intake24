import path from 'node:path';

import type { Express } from 'express';
import { json, urlencoded } from 'body-parser';
import CleanCSS from 'clean-css';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import { pick } from 'lodash';
import morgan from 'morgan';
import nunjucks from 'nunjucks';

import type { Ops } from '@intake24/api/app';
import ioc from '@intake24/api/ioc';
import { httpLogger as stream } from '@intake24/common-backend';

export default async (express: Express, { config }: Ops): Promise<void> => {
  const {
    app,
    mail,
    session: { cookie },
  } = config;

  const isDev = app.env === 'development';

  if (!app.secret) throw new Error('Application secret not set.');

  // Body parser
  express.use(json());
  express.use(urlencoded({ extended: false }));

  // Cookie parser
  express.use(cookieParser(app.secret));

  // Http logger
  express.use(morgan(isDev ? 'dev' : 'combined', { stream }));

  // Session store + middleware
  const client = ioc.cradle.session.init();

  express.use(
    expressSession({
      store: new RedisStore({ client, prefix: '', ttl: cookie.maxAge / 1000 }),
      name: cookie.name,
      cookie,
      saveUninitialized: true,
      secret: app.secret,
      resave: false,
    })
  );

  // Templates
  express.engine('njk', nunjucks.render);
  express.set('view engine', 'njk');

  nunjucks
    .configure([path.resolve('public'), path.resolve('resources/views')], {
      autoescape: true,
      express,
      noCache: isDev,
    })
    .addGlobal('app', {
      ...pick(app, ['name', 'icon', 'fullName', 'poweredBy']),
      year: new Date().getFullYear(),
      replyTo: mail.replyTo,
    })
    .addGlobal('asset', (content: string) => path.join(app.urls.base, content))
    .addFilter('inlineCSS', (content: string) => new CleanCSS().minify(content).styles);
};
