import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/role.controller';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/roles';

const router = Router();

router.use(permission('acl'));

router
  .route('')
  .post(permission('roles-create'), validation.store, wrapAsync(controller.store))
  .get(permission('roles-list'), validation.list, wrapAsync(controller.list));

router.get('/create', permission('roles-create'), wrapAsync(controller.create));

router
  .route('/:roleId')
  .get(permission('roles-detail'), validation.entry('roleId'), wrapAsync(controller.detail))
  .put(
    permission('roles-edit'),
    validation.entry('roleId'),
    validation.update,
    wrapAsync(controller.update)
  )
  .delete(permission('roles-delete'), validation.entry('roleId'), wrapAsync(controller.delete));

router.get(
  '/:roleId/edit',
  permission('roles-edit'),
  validation.entry('roleId'),
  wrapAsync(controller.edit)
);

export default router;
