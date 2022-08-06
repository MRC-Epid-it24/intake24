import '@intake24/api/bootstrap';

import type { Ops } from '@intake24/api/app';
import app from '@intake24/api/app';
import ioc from '@intake24/api/ioc';

const appOps = { config: ioc.cradle.config, logger: ioc.cradle.logger };

const startApp = async (ops: Ops): Promise<void> => {
  const { config, logger } = ops;
  const { name, host, port } = config.app;

  const server = await app(ops);

  // Start listening
  server.listen(port, host, () => {
    logger.child({ service: 'Application' }).info(`${name} is listening on ${host}:${port}!`);
  });
};

(async () => {
  await startApp(appOps);
})();
