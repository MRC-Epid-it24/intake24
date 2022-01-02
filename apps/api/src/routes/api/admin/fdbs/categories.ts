import { Router } from 'express';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';
import validation from '@api/http/requests/admin/fdbs/categories';
import { permission } from '@api/http/middleware/acl';

const { adminCategoryController } = ioc.cradle;
const router = Router({ mergeParams: true });

router
  .route('')
  .post(permission('fdbs-create'), wrapAsync(adminCategoryController.store))
  .get(permission('fdbs-read'), validation.browse, wrapAsync(adminCategoryController.browse));

router.get('/root', permission('fdbs-read'), wrapAsync(adminCategoryController.root));

router
  .route('/:categoryId')
  .get(permission('fdbs-read'), wrapAsync(adminCategoryController.read))
  .put(permission('fdbs-edit'), validation.update, wrapAsync(adminCategoryController.update))
  .delete(permission('fdbs-delete'), wrapAsync(adminCategoryController.destroy));

router.get(
  '/:categoryId/contents',
  permission('fdbs-read'),
  wrapAsync(adminCategoryController.contents)
);

export default router;
