import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/roles';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { roleController } = ioc.cradle;
  const router = Router();

  router.use(permission('acl'));

  router
    .route('')
    .post(permission('roles|create'), validation.store, wrapAsync(roleController.store))
    .get(permission('roles|browse'), validation.browse, wrapAsync(roleController.browse));

  router.get(
    '/refs',
    anyPermission(['roles|create', 'roles|read', 'roles|edit']),
    wrapAsync(roleController.refs)
  );

  router.use('/:roleId', validation.entry('roleId'));

  router
    .route('/:roleId')
    .get(permission('roles|read'), wrapAsync(roleController.read))
    .put(permission('roles|edit'), validation.update, wrapAsync(roleController.update))
    .delete(permission('roles|delete'), wrapAsync(roleController.destroy));

  router.get('/:roleId/edit', permission('roles|edit'), wrapAsync(roleController.edit));

  return router;
};
