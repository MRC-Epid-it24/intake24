import './bootstrap';
import config from '@/config/app';
import logger from '@/services/logger';
import app from './app';

const startApp = async (): Promise<void> => {
  const server = await app();

  // Start listening
  server.listen(config.port, config.host, () => {
    logger.info(`${config.name} is listening on ${config.host}:${config.port}!`);
  });
};

(async () => {
  await startApp();
})();
