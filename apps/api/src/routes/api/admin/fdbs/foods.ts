import { Router } from 'express';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';
import validation from '@intake24/api/http/requests/admin/fdbs/foods';
import { permission } from '@intake24/api/http/middleware/acl';

export default () => {
  const { adminFoodController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  router
    .route('')
    .post(permission('fdbs|create'), wrapAsync(adminFoodController.store))
    .get(permission('fdbs|read'), validation.browse, wrapAsync(adminFoodController.browse));

  router
    .route('/:foodId')
    .get(permission('fdbs|read'), wrapAsync(adminFoodController.read))
    .put(permission('fdbs|edit'), validation.update, wrapAsync(adminFoodController.update))
    .delete(permission('fdbs|delete'), wrapAsync(adminFoodController.destroy));

  return router;
};
