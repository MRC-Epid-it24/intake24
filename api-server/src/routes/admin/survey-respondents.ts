import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/survey-respondent.controller';
import { canManageSurvey } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/users/respondents';

const router = Router({ mergeParams: true });

router.use(canManageSurvey());

router
  .route('')
  .post(validation.store, wrapAsync(controller.store))
  .get(validation.list, wrapAsync(controller.list));

router
  .route('/:userId')
  .put(validation.update, wrapAsync(controller.update))
  .delete(wrapAsync(controller.delete));

export default router;
