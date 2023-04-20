import type { Express } from 'express';
import express from 'express';

import type { Logger } from '@intake24/common-backend';

import type { Config } from './config';
import loaders from './loaders';

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
