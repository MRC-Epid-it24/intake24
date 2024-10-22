import type { Express } from 'express';
import express from 'express';

import type { Config } from '@intake24/api/config';
import loaders from '@intake24/api/loaders';
import type { Logger } from '@intake24/common-backend';

export interface Ops {
  config: Config;
  logger: Logger;
}

export default async (ops: Ops): Promise<Express> => {
  // Init express
  const app = express();

  // Load dependencies
  await loaders(app, ops);

  return app;
};
