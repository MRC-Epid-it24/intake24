import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/users';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminUserController } = ioc.cradle;
  const router = Router();

  router.use(permission('acl', 'users'));

  router
    .route('')
    .post(permission('users|create'), validation.store, wrapAsync(adminUserController.store))
    .get(permission('users|browse'), validation.browse, wrapAsync(adminUserController.browse));

  router.get('/refs', wrapAsync(adminUserController.refs));

  router.use('/:userId', validation.entry('userId'));

  router
    .route('/:userId')
    .get(permission('users|read'), wrapAsync(adminUserController.read))
    .put(permission('users|edit'), validation.update, wrapAsync(adminUserController.update))
    .delete(permission('users|delete'), wrapAsync(adminUserController.destroy));

  router.get('/:userId/edit', permission('users|edit'), wrapAsync(adminUserController.edit));

  router.get(
    '/:userId/permissions',
    permission('users|permissions'),
    validation.browse,
    wrapAsync(adminUserController.permissions)
  );

  router.get(
    '/:userId/roles',
    permission('users|roles'),
    validation.browse,
    wrapAsync(adminUserController.roles)
  );

  return router;
};
