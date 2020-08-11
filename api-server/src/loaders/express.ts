import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import path from 'path';
import { stream } from '@/services/logger';
import { AppLoader } from './loader';

export default async ({ app, env }: AppLoader): Promise<void> => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(morgan('combined', { stream }));
  if (env !== 'production') app.use(morgan('dev'));

  nunjucks.configure(path.resolve('resources/views'), {
    autoescape: true,
    express: app,
    noCache: env === 'development',
  });
};
