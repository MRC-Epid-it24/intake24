import { Router } from 'express';

import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';
import { handleSequelizeErrors, translateSqlErrors } from '@intake24/api/util/sequelize-errors';

export default () => {
  const { adminGlobalCategoriesController } = ioc.cradle;
  const router = Router();

  router.route('').post(wrapAsync(adminGlobalCategoriesController.store));

  router.route('/:categoryId').put(wrapAsync(adminGlobalCategoriesController.update));

  router.route('/:categoryId').get(wrapAsync(adminGlobalCategoriesController.read));

  return router;
};
