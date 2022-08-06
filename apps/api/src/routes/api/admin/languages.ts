import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/languages';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

import languageTranslations from './language-translations';

export default () => {
  const { languageController } = ioc.cradle;
  const router = Router();

  router.use(permission('languages'));

  router
    .route('')
    .post(permission('languages|create'), validation.store, wrapAsync(languageController.store))
    .get(permission('languages|browse'), validation.browse, wrapAsync(languageController.browse));

  router.get('/refs', wrapAsync(languageController.refs));

  router
    .route('/:languageId')
    .get(permission('languages|read'), wrapAsync(languageController.read))
    .put(permission('languages|edit'), validation.update, wrapAsync(languageController.update))
    .delete(permission('languages|delete'), wrapAsync(languageController.destroy));

  router.get('/:languageId/edit', permission('languages|edit'), wrapAsync(languageController.edit));

  router.use('/:languageId/translations', languageTranslations());

  return router;
};
