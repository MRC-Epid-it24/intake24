import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/permission.controller';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/permissions';

const router = Router();

router.use(permission('acl'));

router
  .route('')
  .post(permission('permissions-create'), validation.store, wrapAsync(controller.store))
  .get(permission('permissions-list'), validation.list, wrapAsync(controller.list));

router.get('/create', permission('permissions-create'), wrapAsync(controller.create));

router
  .route('/:permissionId')
  .get(
    permission('permissions-detail'),
    validation.entry('permissionId'),
    wrapAsync(controller.detail)
  )
  .put(
    permission('permissions-edit'),
    validation.entry('permissionId'),
    validation.update,
    wrapAsync(controller.update)
  )
  .delete(
    permission('permissions-delete'),
    validation.entry('permissionId'),
    wrapAsync(controller.delete)
  );

router.get(
  '/:permissionId/edit',
  permission('permissions-edit'),
  validation.entry('permissionId'),
  wrapAsync(controller.edit)
);

export default router;
