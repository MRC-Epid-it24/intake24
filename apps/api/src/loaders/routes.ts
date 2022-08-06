import type { Express } from 'express';
import { body, query } from 'express-validator';

import type { Ops } from '@intake24/api/app';
import { errors } from '@intake24/api/http/middleware';
import { createSanitizer } from '@intake24/api/http/rules';
import routes from '@intake24/api/routes';

import authentication from './authentication';

export default async (app: Express, ops: Ops): Promise<void> => {
  // Request sanitizers
  app.use(body('*').customSanitizer(createSanitizer({ emptyStringToNull: true })));
  app.use(query('*').customSanitizer(createSanitizer({ emptyStringToNull: true })));

  // Mount authentication middleware
  authentication(app);

  // Mount routes
  routes(app, ops);

  // Mount error middleware
  errors(app, ops);
};
