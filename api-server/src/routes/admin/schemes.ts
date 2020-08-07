import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/scheme.controller';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/schemes';

const router = Router();

router.use(permission('acl'));

router
  .route('')
  .post(permission('schemes-create'), validation.store, wrapAsync(controller.store))
  .get(permission('schemes-list'), validation.list, wrapAsync(controller.list));

router.get('/create', permission('schemes-create'), wrapAsync(controller.create));

router
  .route('/:schemeId')
  .get(permission('schemes-detail'), wrapAsync(controller.show))
  .put(permission('schemes-edit'), validation.update, wrapAsync(controller.update))
  .delete(permission('schemes-delete'), wrapAsync(controller.delete));

router.get('/:schemeId/edit', permission('schemes-edit'), wrapAsync(controller.edit));

export default router;
