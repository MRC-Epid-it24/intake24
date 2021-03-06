import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import path from 'path';
import type { Ops } from '@/app';
import { httpLogger as stream } from '@/services/logger';

export default async (app: Express, { config }: Ops): Promise<void> => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Register global public folder
  app.use(express.static(config.filesystem.local.public, { index: false }));

  // Register images folder
  // TODO: this should only be registered when hosted locally
  app.use('/images', express.static(config.filesystem.local.images, { index: false }));

  const isDev = config.app.env === 'development';

  // Register access-log logger
  app.use(morgan(isDev ? 'dev' : 'combined', { stream }));

  nunjucks.configure([path.resolve('public'), path.resolve('resources/views')], {
    autoescape: true,
    express: app,
    noCache: isDev,
  });
};
