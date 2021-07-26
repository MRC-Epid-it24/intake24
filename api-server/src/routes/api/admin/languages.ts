import { Router } from 'express';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/languages';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { languageController } = ioc.cradle;
const router = Router();

router
  .route('')
  .post(permission('languages-create'), validation.store, wrapAsync(languageController.store))
  .get(permission('languages-browse'), validation.browse, wrapAsync(languageController.browse));

router.get('/create', permission('languages-create'), wrapAsync(languageController.create));

router
  .route('/:languageId')
  .get(permission('languages-read'), wrapAsync(languageController.read))
  .put(permission('languages-edit'), validation.update, wrapAsync(languageController.update))
  .delete(permission('languages-delete'), wrapAsync(languageController.destroy));

router.get('/:languageId/edit', permission('languages-edit'), wrapAsync(languageController.edit));

export default router;
