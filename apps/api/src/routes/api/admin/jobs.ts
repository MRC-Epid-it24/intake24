import { Router } from 'express';
import { anyPermission, permission } from '@api/http/middleware/acl';
import validation from '@api/http/requests/admin/jobs';
import { wrapAsync } from '@api/util';
import ioc from '@api/ioc';

const { jobController } = ioc.cradle;

const router = Router();

router.route('').get(permission('jobs-browse'), validation.browse, wrapAsync(jobController.browse));

router.get(
  '/refs',
  anyPermission(['jobs-create', 'jobs-read', 'jobs-edit']),
  wrapAsync(jobController.refs)
);

router
  .route('/:jobId')
  .get(permission('jobs-read'), validation.entry('jobId'), wrapAsync(jobController.read))
  .delete(permission('jobs-delete'), validation.entry('jobId'), wrapAsync(jobController.destroy));

router.get(
  '/:jobId/download',
  permission('jobs-read'),
  validation.entry('jobId'),
  wrapAsync(jobController.download)
);

export default router;
