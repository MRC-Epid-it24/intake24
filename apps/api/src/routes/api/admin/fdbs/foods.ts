import { Router } from 'express';

import validation from '@intake24/api/http/requests/admin/fdbs/foods';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';
import { handleSequelizeErrors } from '@intake24/api/util/sequelize-errors';

export default () => {
  const { adminFoodController, adminLocalFoodsController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  router
    .route('')
    .post(wrapAsync(adminLocalFoodsController.store), handleSequelizeErrors)
    .get(validation.browse, wrapAsync(adminFoodController.browse));

  router
    .route('/:foodId')
    .get(wrapAsync(adminFoodController.read))
    .put(validation.update, wrapAsync(adminFoodController.update))
    .delete(wrapAsync(adminFoodController.destroy));

  return router;
};
