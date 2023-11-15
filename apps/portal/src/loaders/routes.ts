import type { Express } from 'express';

import type { Ops } from '../app';
import routes from '../routes';
import errors from '../routes/errors';

export default (app: Express, ops: Ops) => {
  // Mount routes
  routes(app, ops);

  // Mount error middleware
  errors(app, ops);
};
