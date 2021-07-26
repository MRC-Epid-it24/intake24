import { Router } from 'express';
import validation from '@/http/requests/admin/jobs';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { userJobController } = ioc.cradle;
const router = Router();

router.route('').get(validation.browse, wrapAsync(userJobController.browse));
router.route('/:jobId').get(validation.entry('jobId'), wrapAsync(userJobController.read));
router.get('/:jobId/download', validation.entry('jobId'), wrapAsync(userJobController.download));

export default router;
