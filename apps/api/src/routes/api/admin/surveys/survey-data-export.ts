import { Router } from 'express';
import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/surveys';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminSurveyDataExportController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  router.use(permission('surveys|data-export'));

  router.post('', validation.dataExport, wrapAsync(adminSurveyDataExportController.queue));
  router.post('/sync', validation.dataExport, wrapAsync(adminSurveyDataExportController.sync));

  return router;
};
