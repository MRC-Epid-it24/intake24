import { Router } from 'express';
import { permission, canManageSurvey } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/surveys';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';
import surveyDataExport from './survey-data-export';
import surveyMgmt from './survey-mgmt';
import surveyRespondents from './survey-respondents';

const { adminSurveyController } = ioc.cradle;
const router = Router();

router
  .route('')
  .post(permission('surveys-create'), validation.store, wrapAsync(adminSurveyController.store))
  .get(permission('surveys-list'), validation.list, wrapAsync(adminSurveyController.list));

router.get('/create', permission('surveys-create'), wrapAsync(adminSurveyController.create));

router
  .route('/:surveyId')
  .get(permission('surveys-detail'), canManageSurvey(), wrapAsync(adminSurveyController.detail))
  .put(
    permission('surveys-edit'),
    canManageSurvey(),
    validation.update,
    wrapAsync(adminSurveyController.update)
  )
  .delete(
    permission('surveys-delete'),
    canManageSurvey(),
    wrapAsync(adminSurveyController.destroy)
  );

router.get(
  '/:surveyId/edit',
  permission('surveys-edit'),
  canManageSurvey(),
  wrapAsync(adminSurveyController.edit)
);

router.use('/:surveyId/data-export', surveyDataExport);
router.use('/:surveyId/mgmt', surveyMgmt);
router.use('/:surveyId/respondents', surveyRespondents);

export default router;
