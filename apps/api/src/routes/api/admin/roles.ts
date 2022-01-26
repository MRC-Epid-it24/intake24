import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/roles';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

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

router
  .route('/:roleId')
  .get(permission('roles|read'), validation.entry('roleId'), wrapAsync(roleController.read))
  .put(
    permission('roles|edit'),
    validation.entry('roleId'),
    validation.update,
    wrapAsync(roleController.update)
  )
  .delete(
    permission('roles|delete'),
    validation.entry('roleId'),
    wrapAsync(roleController.destroy)
  );

router.get(
  '/:roleId/edit',
  permission('roles|edit'),
  validation.entry('roleId'),
  wrapAsync(roleController.edit)
);

export default router;
