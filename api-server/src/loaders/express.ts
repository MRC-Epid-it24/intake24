import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import path from 'path';
import fsConfig from '@/config/filesystem';
import { httpLogger as stream } from '@/services/logger';
import { AppLoader } from './loader';

export default async ({ app, env }: AppLoader): Promise<void> => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(fsConfig.local.public));

  app.use(morgan(env === 'production' ? 'combined' : 'dev', { stream }));

  nunjucks.configure(path.resolve('resources/views'), {
    autoescape: true,
    express: app,
    noCache: env === 'development',
  });
};
