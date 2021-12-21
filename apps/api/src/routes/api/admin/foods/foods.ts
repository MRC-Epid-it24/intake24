import { Router } from 'express';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';
import validation from '@api/http/requests/admin/foods';

const { adminFoodController } = ioc.cradle;
const router = Router({ mergeParams: true });

router
  .route('')
  .post(wrapAsync(adminFoodController.store))
  .get(validation.browse, wrapAsync(adminFoodController.browse));

router
  .route('/:foodId')
  .get(wrapAsync(adminFoodController.read))
  .put(wrapAsync(adminFoodController.update))
  .delete(wrapAsync(adminFoodController.destroy));

export default router;
