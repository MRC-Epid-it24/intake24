import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/languages';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { languageController } = ioc.cradle;
const router = Router();

router
  .route('')
  .post(permission('languages-create'), validation.store, wrapAsync(languageController.store))
  .get(permission('languages-browse'), validation.browse, wrapAsync(languageController.browse));

router.get(
  '/refs',
  anyPermission(['languages-create', 'languages-read', 'languages-edit']),
  wrapAsync(languageController.refs)
);

router
  .route('/:languageId')
  .get(permission('languages-read'), wrapAsync(languageController.read))
  .put(permission('languages-edit'), validation.update, wrapAsync(languageController.update))
  .delete(permission('languages-delete'), wrapAsync(languageController.destroy));

router.get('/:languageId/edit', permission('languages-edit'), wrapAsync(languageController.edit));

router.post(
  '/:languageId/init',
  permission('languages-edit'),
  wrapAsync(languageController.initializeMessages)
);

export default router;
