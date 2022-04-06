import { Router } from 'express';
import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/survey-schemes';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { surveySchemeController } = ioc.cradle;
  const router = Router();

  router.use(permission('survey-schemes'));

  router
    .route('')
    .post(
      permission('survey-schemes|create'),
      validation.store,
      wrapAsync(surveySchemeController.store)
    )
    .get(validation.browse, wrapAsync(surveySchemeController.browse));

  router.get('/refs', wrapAsync(surveySchemeController.refs));

  router.post(
    '/copy',
    permission('survey-schemes|copy'),
    validation.copy,
    wrapAsync(surveySchemeController.copy)
  );

  router.use('/:surveySchemeId', validation.entry('surveySchemeId'));

  router
    .route('/:surveySchemeId')
    .get(wrapAsync(surveySchemeController.read))
    .patch(validation.patch, wrapAsync(surveySchemeController.patch))
    .delete(wrapAsync(surveySchemeController.destroy));

  router.get(
    '/:surveySchemeId/templates',
    validation.templates,
    wrapAsync(surveySchemeController.templates)
  );
  router.get('/:surveySchemeId/data-export', wrapAsync(surveySchemeController.dataExportRefs));

  return router;
};
