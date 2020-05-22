import appConfig from '@/config/app';
import logger from '@/services/logger';
import expressLoader from './express';
import routesLoader from './routes';
import securityLoader from './security';
import servicesLoader from './services';
import { AppLoader } from './loader';

export default async ({ app }: AppLoader): Promise<void> => {
  const { env } = appConfig;

  await securityLoader({ app, env });
  logger.info('Security settings loaded.');

  await expressLoader({ app, env });
  logger.info('Express defaults loaded.');

  await routesLoader({ app, env });
  logger.info('Routes loaded.');

  await servicesLoader();
  logger.info('Services loaded.');
};
