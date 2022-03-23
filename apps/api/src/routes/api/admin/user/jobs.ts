import { Router } from 'express';
import validation from '@intake24/api/http/requests/admin/jobs';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminUserJobController } = ioc.cradle;
  const router = Router();

  router.route('').get(validation.browse, wrapAsync(adminUserJobController.browse));

  router.use('/:jobId', validation.entry('jobId'));

  router.route('/:jobId').get(wrapAsync(adminUserJobController.read));
  router.get('/:jobId/download', wrapAsync(adminUserJobController.download));

  return router;
};
