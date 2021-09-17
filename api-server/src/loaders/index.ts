import type { Express } from 'express';
import type { Ops } from '@/app';
import expressLoader from './express';
import routesLoader from './routes';
import securityLoader from './security';
import servicesLoader from './services';

export default async (app: Express, ops: Ops): Promise<void> => {
  const logger = ops.logger.child({ service: 'Application' });

  await securityLoader(app, ops);
  logger.info('Security settings loaded.');

  await expressLoader(app, ops);
  logger.info('Express defaults loaded.');

  await routesLoader(app, ops);
  logger.info('Routes loaded.');

  await servicesLoader();
  logger.info('Services loaded.');
};
