/* eslint-disable perfectionist/sort-imports */
import './bootstrap';

import type { Ops } from './app';

import { logger } from '@intake24/common-backend';

import app from './app';
import config from './config';

function startApp(ops: Ops) {
  const {
    config: {
      app: { name, host, port },
    },
    logger: globalLogger,
  } = ops;

  const server = app(ops);

  // Start listening
  server.listen(port, host, () => {
    globalLogger.child({ service: 'Application' }).info(`${name} is listening on ${host}:${port}!`);
  });
}

(() => {
  startApp({ config, logger });
})();
