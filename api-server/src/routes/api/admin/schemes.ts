import { Router } from 'express';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/schemes';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { schemeController } = ioc.cradle;
const router = Router();

router
  .route('')
  .post(permission('schemes-create'), validation.store, wrapAsync(schemeController.store))
  .get(permission('schemes-browse'), validation.browse, wrapAsync(schemeController.browse));

router.get('/create', permission('schemes-create'), wrapAsync(schemeController.create));

router
  .route('/:schemeId')
  .get(permission('schemes-detail'), wrapAsync(schemeController.detail))
  .put(permission('schemes-edit'), validation.update, wrapAsync(schemeController.update))
  .delete(permission('schemes-delete'), wrapAsync(schemeController.destroy));

router.get('/:schemeId/edit', permission('schemes-edit'), wrapAsync(schemeController.edit));
router.get(
  '/:schemeId/data-export',
  permission('schemes-edit'),
  wrapAsync(schemeController.dataExportRefs)
);

export default router;
