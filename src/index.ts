import './bootstrap';
import express from 'express';
import config from '@/config/app';

const startApp = async (): Promise<void> => {
  // Init express
  const app = express();

  // Start listening
  app.listen(config.port, config.url, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`${config.name} is listening on port ${config.port}!`);
  });
};

startApp();
