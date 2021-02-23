import { Router } from 'express';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/users';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { userController } = ioc.cradle;
const router = Router();

router.use(permission('acl'));

router
  .route('')
  .post(permission('users-create'), validation.store, wrapAsync(userController.store))
  .get(permission('users-browse'), validation.browse, wrapAsync(userController.browse));

router.get('/create', permission('users-create'), wrapAsync(userController.create));

router
  .route('/:userId')
  .get(permission('users-detail'), validation.entry('userId'), wrapAsync(userController.detail))
  .put(
    permission('users-edit'),
    validation.entry('userId'),
    validation.update,
    wrapAsync(userController.update)
  )
  .delete(
    permission('users-delete'),
    validation.entry('userId'),
    wrapAsync(userController.destroy)
  );

router.get(
  '/:userId/edit',
  permission('users-edit'),
  validation.entry('userId'),
  wrapAsync(userController.edit)
);

export default router;
