import { Router } from 'express';
import validation from '@api/http/requests/admin/jobs';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { adminUserJobController } = ioc.cradle;
const router = Router();

router.route('').get(validation.browse, wrapAsync(adminUserJobController.browse));
router.route('/:jobId').get(validation.entry('jobId'), wrapAsync(adminUserJobController.read));
router.get(
  '/:jobId/download',
  validation.entry('jobId'),
  wrapAsync(adminUserJobController.download)
);

export default router;
