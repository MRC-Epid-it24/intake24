import { Router } from 'express';
import { anyPermission, permission } from '@api/http/middleware/acl';
import validation from '@api/http/requests/admin/permissions';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { permissionController } = ioc.cradle;
const router = Router();

router.use(permission('acl'));

router
  .route('')
  .post(permission('permissions-create'), validation.store, wrapAsync(permissionController.store))
  .get(permission('permissions-browse'), validation.browse, wrapAsync(permissionController.browse));

router.get(
  '/refs',
  anyPermission(['permissions-create', 'permissions-read', 'permissions-edit']),
  wrapAsync(permissionController.refs)
);

router
  .route('/:permissionId')
  .get(
    permission('permissions-read'),
    validation.entry('permissionId'),
    wrapAsync(permissionController.read)
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
