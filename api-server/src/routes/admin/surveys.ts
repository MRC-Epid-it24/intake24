import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/survey.controller';
import { permission, canManageSurvey } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/surveys';
import mgmt from './survey-mgmt';
import respondents from './survey-respondents';

const router = Router();

router
  .route('')
  .post(permission('surveys-create'), validation.store, wrapAsync(controller.store))
  .get(permission('surveys-list'), validation.list, wrapAsync(controller.list));

router.get('/create', permission('surveys-create'), wrapAsync(controller.create));

router
  .route('/:surveyId')
  .get(permission('surveys-detail'), canManageSurvey(), wrapAsync(controller.detail))
  .put(
    permission('surveys-edit'),
    canManageSurvey(),
    validation.update,
    wrapAsync(controller.update)
  )
  .delete(permission('surveys-delete'), canManageSurvey(), wrapAsync(controller.delete));

router.get(
  '/:surveyId/edit',
  permission('surveys-edit'),
  canManageSurvey(),
  wrapAsync(controller.edit)
);

router.use('/:surveyId/mgmt', canManageSurvey(), mgmt);
router.use('/:surveyId/respondents', canManageSurvey(), respondents);

export default router;
