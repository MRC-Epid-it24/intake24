import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/schemes';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { schemeController } = ioc.cradle;
const router = Router();

router
  .route('')
  .post(permission('schemes|create'), validation.store, wrapAsync(schemeController.store))
  .get(permission('schemes|browse'), validation.browse, wrapAsync(schemeController.browse));

router.get(
  '/refs',
  anyPermission(['schemes|create', 'schemes|read', 'schemes|edit']),
  wrapAsync(schemeController.refs)
);

router.post('/copy', permission('schemes|edit'), validation.copy, wrapAsync(schemeController.copy));

router
  .route('/:schemeId')
  .get(permission('schemes|read'), wrapAsync(schemeController.read))
  .put(permission('schemes|edit'), validation.update, wrapAsync(schemeController.update))
  .delete(permission('schemes|delete'), wrapAsync(schemeController.destroy));

router.get('/:schemeId/edit', permission('schemes|edit'), wrapAsync(schemeController.edit));
router.get(
  '/:schemeId/templates',
  permission('schemes|edit'),
  validation.templates,
  wrapAsync(schemeController.templates)
);
router.get(
  '/:schemeId/data-export',
  permission('schemes|edit'),
  wrapAsync(schemeController.dataExportRefs)
);

export default router;
