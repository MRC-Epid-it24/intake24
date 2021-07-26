import { Router } from 'express';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/locales';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { localeController } = ioc.cradle;
const router = Router();

router
  .route('')
  .post(permission('locales-create'), validation.store, wrapAsync(localeController.store))
  .get(permission('locales-browse'), validation.browse, wrapAsync(localeController.browse));

router.get('/create', permission('locales-create'), wrapAsync(localeController.create));

router
  .route('/:localeId')
  .get(permission('locales-read'), wrapAsync(localeController.read))
  .put(permission('locales-edit'), validation.update, wrapAsync(localeController.update))
  .delete(permission('locales-delete'), wrapAsync(localeController.destroy));

router.get('/:localeId/edit', permission('locales-edit'), wrapAsync(localeController.edit));

export default router;
