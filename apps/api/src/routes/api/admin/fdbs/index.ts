import { Router } from 'express';

import { canManageFoodDatabase, permission } from '@intake24/api/http/middleware';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

import categories from './categories';
import foods from './foods';

export default () => {
  const router = Router();

  const { adminFoodDatabaseController } = ioc.cradle;

  router.get('', permission('fdbs|browse'), wrapAsync(adminFoodDatabaseController.browse));

  router.get('/refs', wrapAsync(adminFoodDatabaseController.refs));

  router.use('/:localeId', canManageFoodDatabase());

  router.get('/:localeId', permission('fdbs|read'), wrapAsync(adminFoodDatabaseController.read));

  router.use('/:localeId/categories', categories());
  router.use('/:localeId/foods', foods());

  return router;
};
