import { Router } from 'express';
import { permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/users/submissions';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminSurveySubmissionController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  router.use(permission('surveys|submissions'));

  router.get('', validation.browse, wrapAsync(adminSurveySubmissionController.browse));

  router
    .route('/:submissionId')
    .get(wrapAsync(adminSurveySubmissionController.entry))
    .delete(wrapAsync(adminSurveySubmissionController.destroy));
  return router;
};
