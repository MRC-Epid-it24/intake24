import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/jobs';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { jobController } = ioc.cradle;

  const router = Router();

  router.use(permission('jobs'));

  router
    .route('')
    .get(permission('jobs|browse'), validation.browse, wrapAsync(jobController.browse));

  router.get('/refs', wrapAsync(jobController.refs));

  router.use('/:jobId', validation.entry('jobId'));

  router
    .route('/:jobId')
    .get(permission('jobs|read'), wrapAsync(jobController.read))
    .delete(permission('jobs|delete'), wrapAsync(jobController.destroy));

  router.get('/:jobId/download', permission('jobs|read'), wrapAsync(jobController.download));

  router.post('/:jobId/repeat', permission('jobs|edit'), wrapAsync(jobController.repeat));

  return router;
};
