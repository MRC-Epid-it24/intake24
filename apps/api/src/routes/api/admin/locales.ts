import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/locales';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { localeController } = ioc.cradle;
  const router = Router();

  router
    .route('')
    .post(permission('locales|create'), validation.store, wrapAsync(localeController.store))
    .get(permission('locales|browse'), validation.browse, wrapAsync(localeController.browse));

  router.get(
    '/refs',
    anyPermission(['locales|create', 'locales|read', 'locales|edit']),
    wrapAsync(localeController.refs)
  );

  router
    .route('/:localeId')
    .get(permission('locales|read'), wrapAsync(localeController.read))
    .put(permission('locales|edit'), validation.update, wrapAsync(localeController.update))
    .delete(permission('locales|delete'), wrapAsync(localeController.destroy));

  router.get('/:localeId/edit', permission('locales|edit'), wrapAsync(localeController.edit));

  return router;
};
