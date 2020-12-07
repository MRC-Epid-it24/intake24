import { Router } from 'express';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/permissions';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { permissionController } = ioc.cradle;
const router = Router();

router.use(permission('acl'));

router
  .route('')
  .post(permission('permissions-create'), validation.store, wrapAsync(permissionController.store))
  .get(permission('permissions-list'), validation.list, wrapAsync(permissionController.list));

router.get('/create', permission('permissions-create'), wrapAsync(permissionController.create));

router
  .route('/:permissionId')
  .get(
    permission('permissions-detail'),
    validation.entry('permissionId'),
    wrapAsync(permissionController.detail)
  )
  .put(
    permission('permissions-edit'),
    validation.entry('permissionId'),
    validation.update,
    wrapAsync(permissionController.update)
  )
  .delete(
    permission('permissions-delete'),
    validation.entry('permissionId'),
    wrapAsync(permissionController.destroy)
  );

router.get(
  '/:permissionId/edit',
  permission('permissions-edit'),
  validation.entry('permissionId'),
  wrapAsync(permissionController.edit)
);

export default router;
