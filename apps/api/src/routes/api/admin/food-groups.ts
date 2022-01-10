import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/fdbs/groups';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { adminFoodGroupController } = ioc.cradle;
const router = Router();

router
  .route('')
  .post(
    permission('food-groups-create'),
    validation.store,
    wrapAsync(adminFoodGroupController.store)
  )
  .get(
    permission('food-groups-browse'),
    validation.browse,
    wrapAsync(adminFoodGroupController.browse)
  );

router.get(
  '/refs',
  anyPermission(['food-groups-create', 'food-groups-read', 'food-groups-edit']),
  wrapAsync(adminFoodGroupController.refs)
);

router
  .route('/:foodGroupId')
  .get(
    permission('food-groups-read'),
    validation.entry('foodGroupId'),
    wrapAsync(adminFoodGroupController.read)
  )
  .put(
    permission('food-groups-edit'),
    validation.entry('foodGroupId'),
    validation.update,
    wrapAsync(adminFoodGroupController.update)
  )
  .delete(
    permission('food-groups-delete'),
    validation.entry('foodGroupId'),
    wrapAsync(adminFoodGroupController.destroy)
  );

router.get(
  '/:foodGroupId/edit',
  permission('food-groups-edit'),
  validation.entry('foodGroupId'),
  wrapAsync(adminFoodGroupController.edit)
);

export default router;
