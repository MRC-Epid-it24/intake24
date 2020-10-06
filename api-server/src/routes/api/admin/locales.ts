import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/locale.controller';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/locales';

const router = Router();

router
  .route('')
  .post(permission('locales-create'), validation.store, wrapAsync(controller.store))
  .get(permission('locales-list'), validation.list, wrapAsync(controller.list));

router.get('/create', permission('locales-create'), wrapAsync(controller.create));

router
  .route('/:localeId')
  .get(permission('locales-detail'), wrapAsync(controller.detail))
  .put(permission('locales-edit'), validation.update, wrapAsync(controller.update))
  .delete(permission('locales-delete'), wrapAsync(controller.delete));

router.get('/:localeId/edit', permission('locales-edit'), wrapAsync(controller.edit));

export default router;
