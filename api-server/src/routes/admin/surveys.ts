import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/survey.controller';
import { canCreateSurvey, canManageSurvey } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/surveys';
import respondents from './survey-respondents';
import mgmt from './survey-mgmt';

const router = Router();

router
  .route('')
  .post(validation.store, canCreateSurvey(), wrapAsync(controller.store))
  .get(validation.list, canManageSurvey(), wrapAsync(controller.list));

router.get('/create', canCreateSurvey(), wrapAsync(controller.create));

router
  .route('/:surveyId')
  .get(canManageSurvey(), wrapAsync(controller.show))
  .put(canManageSurvey(), validation.update, wrapAsync(controller.update))
  .delete(canManageSurvey(), wrapAsync(controller.delete));

router.get('/:surveyId/edit', canManageSurvey(), wrapAsync(controller.edit));

router.use('/:surveyId/respondents', respondents);
router.use('/:surveyId/mgmt', mgmt);

export default router;
