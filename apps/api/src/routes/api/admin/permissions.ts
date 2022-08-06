import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/permissions';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { permissionController } = ioc.cradle;
  const router = Router();

  router.use(permission(['acl', 'permissions']));

  router
    .route('')
    .post(permission('permissions|create'), validation.store, wrapAsync(permissionController.store))
    .get(
      permission('permissions|browse'),
      validation.browse,
      wrapAsync(permissionController.browse)
    );

  router.get('/refs', wrapAsync(permissionController.refs));

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
