import { Router } from 'express';

import validation from '@intake24/api/http/requests/admin/fdbs/foods';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminFoodController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  router
    .route('')
    .post(validation.store, wrapAsync(adminFoodController.store))
    .get(validation.browse, wrapAsync(adminFoodController.browse));

  // This is not very elegant because /by-code potentially clashes with /:foodId, but
  // since food ids are numbers this is fine
  router
    .route('/by-code/:foodCode')
    .get(wrapAsync(adminFoodController.readByCode));

  router
    .route('/:foodId')
    .get(wrapAsync(adminFoodController.read))
    .put(validation.update, wrapAsync(adminFoodController.update))
    .delete(wrapAsync(adminFoodController.destroy));

  router.get('/:foodId/categories', wrapAsync(adminFoodController.categories));
  router.post('/:foodId/copy', validation.copy, wrapAsync(adminFoodController.copy));

  return router;
};
