import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/permissions';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { permissionController } = ioc.cradle;
  const router = Router();

  router.use(permission('acl'));

  router
    .route('')
    .post(permission('permissions|create'), validation.store, wrapAsync(permissionController.store))
    .get(
      permission('permissions|browse'),
      validation.browse,
      wrapAsync(permissionController.browse)
    );

  router.get(
    '/refs',
    anyPermission(['permissions|create', 'permissions|read', 'permissions|edit']),
    wrapAsync(permissionController.refs)
  );

  router.use('/:permissionId', validation.entry('permissionId'));

  router
    .route('/:permissionId')
    .get(permission('permissions|read'), wrapAsync(permissionController.read))
    .put(permission('permissions|edit'), validation.update, wrapAsync(permissionController.update))
    .delete(permission('permissions|delete'), wrapAsync(permissionController.destroy));

  router.get(
    '/:permissionId/edit',
    permission('permissions|edit'),
    wrapAsync(permissionController.edit)
  );

  return router;
};
