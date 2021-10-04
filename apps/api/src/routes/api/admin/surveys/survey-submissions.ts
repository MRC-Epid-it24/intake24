import { Router } from 'express';
import { permission } from '@api/http/middleware/acl';
import validation from '@api/http/requests/admin/users/submissions';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { adminSurveySubmissionController } = ioc.cradle;
const router = Router({ mergeParams: true });

router.use(permission('surveys-submissions'));

router.get('', validation.browse, wrapAsync(adminSurveySubmissionController.browse));

router
  .route('/:submissionId')
  .get(wrapAsync(adminSurveySubmissionController.entry))
  .delete(wrapAsync(adminSurveySubmissionController.destroy));

export default router;
