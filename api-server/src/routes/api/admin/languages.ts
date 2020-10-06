import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/language.controller';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/languages';

const router = Router();

router
  .route('')
  .post(permission('languages-create'), validation.store, wrapAsync(controller.store))
  .get(permission('languages-list'), validation.list, wrapAsync(controller.list));

router.get('/create', permission('languages-create'), wrapAsync(controller.create));

router
  .route('/:languageId')
  .get(permission('languages-detail'), wrapAsync(controller.detail))
  .put(permission('languages-edit'), validation.update, wrapAsync(controller.update))
  .delete(permission('languages-delete'), wrapAsync(controller.delete));

router.get('/:languageId/edit', permission('languages-edit'), wrapAsync(controller.edit));

export default router;
