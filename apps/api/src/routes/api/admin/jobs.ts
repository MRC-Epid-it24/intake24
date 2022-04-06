import { Router } from 'express';
import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/jobs';
import { wrapAsync } from '@intake24/api/util';
import ioc from '@intake24/api/ioc';

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
    .get(permission('jobs|read'), validation.entry('jobId'), wrapAsync(jobController.read))
    .delete(permission('jobs|delete'), validation.entry('jobId'), wrapAsync(jobController.destroy));

  router.get(
    '/:jobId/download',
    permission('jobs|read'),
    validation.entry('jobId'),
    wrapAsync(jobController.download)
  );

  return router;
};
