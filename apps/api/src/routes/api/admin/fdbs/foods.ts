import { Router } from 'express';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';
import validation from '@api/http/requests/admin/fdbs/foods';
import { permission } from '@api/http/middleware/acl';

const { adminFoodController } = ioc.cradle;
const router = Router({ mergeParams: true });

router
  .route('')
  .post(permission('fdbs-create'), wrapAsync(adminFoodController.store))
  .get(permission('fdbs-read'), validation.browse, wrapAsync(adminFoodController.browse));

router
  .route('/:foodId')
  .get(permission('fdbs-read'), wrapAsync(adminFoodController.read))
  .put(permission('fdbs-edit'), validation.update, wrapAsync(adminFoodController.update))
  .delete(permission('fdbs-delete'), wrapAsync(adminFoodController.destroy));

export default router;
