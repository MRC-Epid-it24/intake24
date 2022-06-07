import type { Express } from 'express';
import routes from '../routes';
import errors from '../routes/errors';
import type { Ops } from '../app';

export default async (app: Express, ops: Ops): Promise<void> => {
  // Mount routes
  routes(app, ops);

  // Mount error middleware
  errors(app, ops);
};
