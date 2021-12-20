import { Router } from 'express';
import { anyPermission, permission } from '@api/http/middleware/acl';
import validation from '@api/http/requests/admin/users';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { adminUserController } = ioc.cradle;
const router = Router();

router.use(permission('acl'));

router
  .route('')
  .post(permission('users-create'), validation.store, wrapAsync(adminUserController.store))
  .get(permission('users-browse'), validation.browse, wrapAsync(adminUserController.browse));

router.get(
  '/refs',
  anyPermission(['users-create', 'users-read', 'users-edit']),
  wrapAsync(adminUserController.refs)
);

router
  .route('/:userId')
  .get(permission('users-read'), validation.entry('userId'), wrapAsync(adminUserController.read))
  .put(
    permission('users-edit'),
    validation.entry('userId'),
    validation.update,
    wrapAsync(adminUserController.update)
  )
  .delete(
    permission('users-delete'),
    validation.entry('userId'),
    wrapAsync(adminUserController.destroy)
  );

router.get(
  '/:userId/edit',
  permission('users-edit'),
  validation.entry('userId'),
  wrapAsync(adminUserController.edit)
);

export default router;
