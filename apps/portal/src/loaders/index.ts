import type { Express } from 'express';

import type { Ops } from '../app';
import expressLoader from './express';
import routesLoader from './routes';

export default (app: Express, ops: Ops) => {
  const logger = ops.logger.child({ service: 'Application' });

  expressLoader(app, ops);
  logger.info('Express defaults loaded.');

  routesLoader(app, ops);
  logger.info('Routes loaded.');
};
