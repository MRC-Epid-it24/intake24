import express, { Express } from 'express';
import type { Logger } from 'winston';
import type { Config } from '@api/config';
import loaders from '@api/loaders';

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
