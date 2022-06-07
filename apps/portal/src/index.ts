import './bootstrap';
import { logger } from '@intake24/services';
import config from './config';
import app, { Ops } from './app';

const startApp = async (ops: Ops): Promise<void> => {
  const {
    config: {
      app: { name, host, port },
    },
    logger: globalLogger,
  } = ops;

  const server = await app(ops);

  // Start listening
  server.listen(port, host, () => {
    globalLogger.child({ service: 'Application' }).info(`${name} is listening on ${host}:${port}!`);
  });
};

(async () => {
  await startApp({ config, logger });
})();
