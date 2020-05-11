import './bootstrap';
import express from 'express';
import config from '@/config/app';
import loaders from '@/loaders';
import logger from '@/services/logger';

const startApp = async (): Promise<void> => {
  // Init express
  const app = express();

  // Load dependencies
  await loaders({ app });

  // Start listening
  app.listen(config.port, config.url, (err) => {
    if (err) {
      logger.error(err);
      return;
    }
    logger.info(`${config.name} is listening on port ${config.port}!`);
  });
};

startApp();
