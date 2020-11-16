import { body } from 'express-validator';
import errors from '@/http/middleware/errors';
import { trimStrings } from '@/http/rules';
import routes from '@/routes';
import authentication from './authentication';
import { AppLoader } from './loader';

export default async ({ app }: AppLoader): Promise<void> => {
  // Mount authentication middleware
  authentication({ app });

  // Mount routes
  routes({ app });

  // Mount error middleware
  errors({ app });

  // Request sanitizers
  app.use(body('*').customSanitizer(trimStrings));
};
