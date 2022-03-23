import { Router } from 'express';
import { anyPermission, permission, canManageSurvey } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/surveys';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';
import surveyDataExport from './survey-data-export';
import surveyMgmt from './survey-mgmt';
import surveyRespondents from './survey-respondents';
import surveySubmissions from './survey-submissions';

export default () => {
  const { adminSurveyController } = ioc.cradle;
  const router = Router();

  router
    .route('')
    .post(permission('surveys|create'), validation.store, wrapAsync(adminSurveyController.store))
    .get(permission('surveys|browse'), validation.browse, wrapAsync(adminSurveyController.browse));

  router.get(
    '/refs',
    anyPermission(['surveys|create', 'surveys|read', 'surveys|edit']),
    wrapAsync(adminSurveyController.refs)
  );

  router.use('/:surveyId', canManageSurvey());

  router
    .route('/:surveyId')
    .get(permission('surveys|read'), wrapAsync(adminSurveyController.read))
    .put(
      permission(['surveys|edit', 'surveyadmin']),
      validation.put,
      wrapAsync(adminSurveyController.put)
    )
    .patch(
      anyPermission(['surveys|edit', 'surveys|overrides']),
      validation.patch,
      wrapAsync(adminSurveyController.patch)
    )
    .delete(permission('surveys|delete'), wrapAsync(adminSurveyController.destroy));

  router.get('/:surveyId/edit', permission('surveys|edit'), wrapAsync(adminSurveyController.edit));

  router.use('/:surveyId/data-export', surveyDataExport());
  router.use('/:surveyId/mgmt', surveyMgmt());
  router.use('/:surveyId/respondents', surveyRespondents());
  router.use('/:surveyId/submissions', surveySubmissions());

  return router;
};
