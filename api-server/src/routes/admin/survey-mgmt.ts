import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/survey-mgmt.controller';
import { canManageSurvey } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/surveys';

const router = Router({ mergeParams: true });

router.use(canManageSurvey());

router
  .route('')
  .post(validation.store, wrapAsync(controller.store))
  .get(validation.list, wrapAsync(controller.list));

export default router;
