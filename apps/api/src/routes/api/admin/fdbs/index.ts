import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/fdbs';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

import categories from './categories';
import foods from './foods';

export default () => {
  const { adminFoodDatabaseController } = ioc.cradle;
  const router = Router();

  router.use(permission('locales'));

  router.get('', validation.browse, wrapAsync(adminFoodDatabaseController.browse));
  router.get('/refs', wrapAsync(adminFoodDatabaseController.refs));
  router.get('/:localeId', wrapAsync(adminFoodDatabaseController.read));

  router.use('/:localeId/categories', categories());
  router.use('/:localeId/foods', foods());

  return router;
};
