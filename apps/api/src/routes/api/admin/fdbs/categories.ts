import { Router } from 'express';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';
import validation from '@api/http/requests/admin/fdbs/categories';

const { adminCategoryController } = ioc.cradle;
const router = Router({ mergeParams: true });

router
  .route('')
  .post(wrapAsync(adminCategoryController.store))
  .get(validation.browse, wrapAsync(adminCategoryController.browse));

router.get('/root', wrapAsync(adminCategoryController.root));

router
  .route('/:categoryId')
  .get(wrapAsync(adminCategoryController.read))
  .put(validation.update, wrapAsync(adminCategoryController.update))
  .delete(wrapAsync(adminCategoryController.destroy));

router.route('/:categoryId/contents').get(wrapAsync(adminCategoryController.contents));

export default router;
