import { Router } from 'express';

import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminLocalCategoriesController } = ioc.cradle;
  const router = Router();

  router.route('/:localeId').post(wrapAsync(adminLocalCategoriesController.store));

  router
    .route('/:localeId/:categoryId')
    .get(wrapAsync(adminLocalCategoriesController.read))
    .put(wrapAsync(adminLocalCategoriesController.update));

  return router;
};
