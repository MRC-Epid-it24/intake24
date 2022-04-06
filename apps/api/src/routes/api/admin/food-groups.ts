import { Router } from 'express';
import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/fdbs/groups';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminFoodGroupController } = ioc.cradle;
  const router = Router();

  router.use(permission('food-groups'));

  router
    .route('')
    .post(
      permission('food-groups|create'),
      validation.store,
      wrapAsync(adminFoodGroupController.store)
    )
    .get(
      permission('food-groups|browse'),
      validation.browse,
      wrapAsync(adminFoodGroupController.browse)
    );

  router.get('/refs', wrapAsync(adminFoodGroupController.refs));

  router.use('/:foodGroupId', validation.entry('foodGroupId'));

  router
    .route('/:foodGroupId')
    .get(permission('food-groups|read'), wrapAsync(adminFoodGroupController.read))
    .put(
      permission('food-groups|edit'),
      validation.update,
      wrapAsync(adminFoodGroupController.update)
    )
    .delete(permission('food-groups|delete'), wrapAsync(adminFoodGroupController.destroy));

  router.get(
    '/:foodGroupId/edit',
    permission('food-groups|edit'),
    wrapAsync(adminFoodGroupController.edit)
  );

  return router;
};
