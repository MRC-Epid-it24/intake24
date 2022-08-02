import { Router } from 'express';
import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/languages';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { languageTranslationController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  router.use(permission('languages|translations'));

  router
    .route('')
    .get(wrapAsync(languageTranslationController.browse))
    .post(wrapAsync(languageTranslationController.store))
    .put(validation.translations, wrapAsync(languageTranslationController.update))
    .delete(wrapAsync(languageTranslationController.destroy));

  router.route('/sync').post(wrapAsync(languageTranslationController.sync));

  return router;
};
