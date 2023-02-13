import '@intake24/api/bootstrap';

import { createServer } from 'node:https';
import { homedir } from 'node:os';
import { join } from 'node:path';

import type { Express } from 'express';
import type { Server } from 'node:https';
import { readFile } from 'fs-extra';

import type { Ops } from '@intake24/api/app';
import app from '@intake24/api/app';
import ioc from '@intake24/api/ioc';

const appOps = { config: ioc.cradle.config, logger: ioc.cradle.logger };

const startApp = async (ops: Ops): Promise<void> => {
  const { config, logger } = ops;
  const { name, host, port, https } = config.app;

  let server: Express | Server = await app(ops);

  if (https) {
    const home = homedir();
    const [cert, key] = await Promise.all([
      readFile(join(home, '.vite-plugin-mkcert/cert.pem')),
      readFile(join(home, '.vite-plugin-mkcert/dev.pem')),
    ]);

    server = createServer({ key, cert }, server);
  }

  // Start listening
  server.listen(port, host, () => {
    logger.child({ service: 'Application' }).info(`${name} is listening on ${host}:${port}!`);
  });
};

(async () => {
  await startApp(appOps);
})();
