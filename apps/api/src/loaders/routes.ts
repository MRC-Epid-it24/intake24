import type { Express } from 'express';
import { body } from 'express-validator';
import type { Ops } from '@api/app';
import errors from '@api/http/middleware/errors';
import { sanitize, trimStrings } from '@api/http/rules';
import routes from '@api/routes';
import authentication from './authentication';

export default async (app: Express, ops: Ops): Promise<void> => {
  // Request sanitizers
  app.use(body('*').customSanitizer(trimStrings).customSanitizer(sanitize));

  // Mount authentication middleware
  authentication(app);

  // Mount routes
  routes(app, ops);

  // Mount error middleware
  errors(app, ops);
};
