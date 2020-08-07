import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/user.controller';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/users/generic';

const router = Router();

router.use(permission('acl'));

router
  .route('')
  .post(permission('users-create'), validation.store, wrapAsync(controller.store))
  .get(permission('users-list'), validation.list, wrapAsync(controller.list));

router.get('/create', permission('users-create'), wrapAsync(controller.create));

router
  .route('/:userId')
  .get(permission('users-detail'), validation.entry('userId'), wrapAsync(controller.show))
  .put(
    permission('users-edit'),
    validation.entry('userId'),
    validation.update,
    wrapAsync(controller.update)
  )
  .delete(permission('users-delete'), validation.entry('userId'), wrapAsync(controller.delete));

router.get(
  '/:userId/edit',
  permission('roles-edit'),
  validation.entry('userId'),
  wrapAsync(controller.edit)
);

export default router;
