import { Router } from 'express';

import validation from '@intake24/api/http/requests/admin/surveys/submissions';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminSurveySubmissionController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  router.get('', validation.browse, wrapAsync(adminSurveySubmissionController.browse));

  router
    .route('/:submissionId')
    .get(wrapAsync(adminSurveySubmissionController.entry))
    .delete(wrapAsync(adminSurveySubmissionController.destroy));

  return router;
};
