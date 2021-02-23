import { Router } from 'express';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/roles';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { roleController } = ioc.cradle;
const router = Router();

router.use(permission('acl'));

router
  .route('')
  .post(permission('roles-create'), validation.store, wrapAsync(roleController.store))
  .get(permission('roles-browse'), validation.browse, wrapAsync(roleController.browse));

router.get('/create', permission('roles-create'), wrapAsync(roleController.create));

router
  .route('/:roleId')
  .get(permission('roles-detail'), validation.entry('roleId'), wrapAsync(roleController.detail))
  .put(
    permission('roles-edit'),
    validation.entry('roleId'),
    validation.update,
    wrapAsync(roleController.update)
  )
  .delete(
    permission('roles-delete'),
    validation.entry('roleId'),
    wrapAsync(roleController.destroy)
  );

router.get(
  '/:roleId/edit',
  permission('roles-edit'),
  validation.entry('roleId'),
  wrapAsync(roleController.edit)
);

export default router;
