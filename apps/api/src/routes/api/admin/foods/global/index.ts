import { Router } from 'express';

import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';
import { handleSequelizeErrors } from '@intake24/api/util/sequelize-errors';

export default () => {
  const { adminGlobalFoodsController } = ioc.cradle;
  const router = Router();

  router.route('').post(wrapAsync(adminGlobalFoodsController.store), handleSequelizeErrors);

  router
    .route('/:foodId')
    .get(wrapAsync(adminGlobalFoodsController.read))
    .put(wrapAsync(adminGlobalFoodsController.update));

  return router;
};
