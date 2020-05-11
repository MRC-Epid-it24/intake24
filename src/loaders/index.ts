import appConfig from '@/config/app';
import logger from '@/services/logger';
import expressLoader from './express';
import securityLoader from './security';
import { AppLoader } from './loader';

export default async ({ app }: AppLoader): Promise<void> => {
  const { env } = appConfig;

  await securityLoader({ app, env });
  logger.info('Security settings intialized.');

  await expressLoader({ app, env });
  logger.info('Express defaults intialized.');
};
