import type { Request, Response } from 'express';
import { Router } from 'express';

import admin from './admin';
import authentication from './authentication';
import categories from './categories';
import feedback from './feedback';
import foods from './foods';
import i18n from './i18n';
import password from './password';
import portionSizes from './portion-sizes';
import subscriptions from './subscriptions';
import surveys from './surveys';
import user from './user';

export default () => {
  const router = Router();

  // Unauthenticated
  router.use('/auth', authentication());
  router.use('/password', password());
  router.use('/i18n', i18n());

  // Admin
  router.use('/admin', admin());

  // Survey / User
  router.use('/feedback', feedback());
  router.use('/foods', foods());
  router.use('/categories', categories());
  router.use('/portion-sizes', portionSizes());
  router.use('/subscriptions', subscriptions());
  router.use('/surveys', surveys());
  router.use('/user', user());

  router.all('*', (req: Request, res: Response): void => {
    res.status(404).json('Invalid route');
  });

  return router;
};
