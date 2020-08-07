import { Router } from 'express';
import controller from '@/http/controllers/admin/survey-respondent.controller';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/users/respondents';
import { wrapAsync } from '@/util';

const router = Router({ mergeParams: true });

router.use(permission('surveys-edit'));

router
  .route('')
  .post(validation.store, wrapAsync(controller.store))
  .get(validation.list, wrapAsync(controller.list));

router
  .route('/:userId')
  .put(validation.update, wrapAsync(controller.update))
  .delete(wrapAsync(controller.delete));

export default router;
