import { Router } from 'express';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { adminCategoryController } = ioc.cradle;
const router = Router({ mergeParams: true });

router
  .route('')
  .post(wrapAsync(adminCategoryController.store))
  .get(wrapAsync(adminCategoryController.browse));

router.get('/root', wrapAsync(adminCategoryController.root));

router
  .route('/:categoryId')
  .get(wrapAsync(adminCategoryController.read))
  .put(wrapAsync(adminCategoryController.update))
  .delete(wrapAsync(adminCategoryController.destroy));

router.route('/:categoryId/contents').get(wrapAsync(adminCategoryController.contents));

export default router;
