import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';

import categories from './categories';
import foods from './foods';

export default () => {
  const router = Router();

  router.use(permission('locales'));

  router.use('/:localeId/categories', categories());
  router.use('/:localeId/foods', foods());

  return router;
};
