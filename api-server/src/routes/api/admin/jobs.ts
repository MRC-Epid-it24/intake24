import { Router } from 'express';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/jobs';
import { wrapAsync } from '@/util';
import ioc from '@/ioc';

const { jobController } = ioc.cradle;

const router = Router();

router.route('').get(permission('jobs-browse'), validation.browse, wrapAsync(jobController.browse));

router
  .route('/:jobId')
  .get(permission('jobs-detail'), validation.entry('jobId'), wrapAsync(jobController.detail))
  .delete(permission('jobs-delete'), validation.entry('jobId'), wrapAsync(jobController.destroy));

router.get(
  '/:jobId/download',
  permission('jobs-detail'),
  validation.entry('jobId'),
  wrapAsync(jobController.download)
);

export default router;
