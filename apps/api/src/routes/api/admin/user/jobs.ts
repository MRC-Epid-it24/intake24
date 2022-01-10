import { Router } from 'express';
import validation from '@intake24/api/http/requests/admin/jobs';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

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
