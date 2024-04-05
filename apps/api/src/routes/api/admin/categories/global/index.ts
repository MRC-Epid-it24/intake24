import { Router } from 'express';

import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminGlobalCategoriesController } = ioc.cradle;
  const router = Router();

  router.route('').post(wrapAsync(adminGlobalCategoriesController.store));

  router
    .route('/:categoryId')
    .get(wrapAsync(adminGlobalCategoriesController.read))
    .put(wrapAsync(adminGlobalCategoriesController.update));

  return router;
};
