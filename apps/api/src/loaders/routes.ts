import type { Express } from 'express';
import { body, query } from 'express-validator';

import type { Ops } from '@intake24/api/app';
import { errors } from '@intake24/api/http/middleware';
import routes from '@intake24/api/routes';
import { createSanitizer } from '@intake24/common/rules';

import authentication from './authentication';

export default (app: Express, ops: Ops) => {
  // Request sanitizers
  app.use(body('*').customSanitizer(createSanitizer({ allowHtml: true, emptyStringToNull: true })));
  app.use(query('*').customSanitizer(createSanitizer({ emptyStringToNull: true })));

  // Mount authentication middleware
  authentication(app);

  // Mount routes
  routes(app, ops);

  // Mount error middleware
  errors(app, ops);
};
