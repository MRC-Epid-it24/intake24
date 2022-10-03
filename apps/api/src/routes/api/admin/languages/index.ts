import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/languages';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

import securables from '../securables';
import languageTranslations from './language-translations';

export default () => {
  const { languageController } = ioc.cradle;
  const router = Router();

  router.use(permission('languages'));

  router
    .route('')
    .post(permission('languages|create'), validation.store, wrapAsync(languageController.store))
    .get(validation.browse, wrapAsync(languageController.browse));

  router.get('/refs', wrapAsync(languageController.refs));

  router.use('/:languageId', validation.entry('languageId'));

  router
    .route('/:languageId')
    .get(wrapAsync(languageController.read))
    .put(validation.update, wrapAsync(languageController.update))
    .delete(wrapAsync(languageController.destroy));

  router.get('/:languageId/edit', wrapAsync(languageController.edit));

  router.use('/:languageId/translations', languageTranslations());

  router.use('/:languageId/securables', securables('Language', languageController.securables));

  return router;
};
