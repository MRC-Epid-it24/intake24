import express from 'express';

import type { Logger } from '@intake24/common-backend';

import type { Config } from './config';
import loaders from './loaders';

export interface Ops {
  config: Config;
  logger: Logger;
}

export default (ops: Ops) => {
  // Init express
  const app = express();

  // Load dependencies
  loaders(app, ops);

  return app;
};
