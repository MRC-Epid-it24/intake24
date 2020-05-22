import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/survey.controller';
import { canManageSurvey, isSurveyAdmin } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/surveys';

const router = Router();

router
  .route('')
  .post(validation.store, isSurveyAdmin(), wrapAsync(controller.store))
  .get(validation.list, canManageSurvey(), wrapAsync(controller.list));

router.get('/create', isSurveyAdmin(), wrapAsync(controller.create));

router
  .route('/:id')
  .get(validation.entry, canManageSurvey(), wrapAsync(controller.show))
  .put(validation.entry, canManageSurvey(), validation.update, wrapAsync(controller.update))
  .delete(validation.entry, canManageSurvey(), wrapAsync(controller.delete));

router.get('/:id/edit', canManageSurvey(), validation.entry, wrapAsync(controller.edit));

export default router;
