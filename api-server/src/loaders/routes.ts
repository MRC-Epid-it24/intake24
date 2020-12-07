import type { Express } from 'express';
import { body } from 'express-validator';
import type { Ops } from '@/app';
import errors from '@/http/middleware/errors';
import { trimStrings } from '@/http/rules';
import routes from '@/routes';
import authentication from './authentication';

export default async (app: Express, ops: Ops): Promise<void> => {
  // Request sanitizers
  app.use(body('*').customSanitizer(trimStrings));

  // Mount authentication middleware
  authentication(app);

  // Mount routes
  routes(app, ops);

  // Mount error middleware
  errors(app, ops);
};
