import { Router } from 'express';
import validation from '@/http/requests/admin/jobs';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { jobController } = ioc.cradle;
const router = Router();

router.route('').get(validation.list, wrapAsync(jobController.list));
router.route('/:jobId').get(wrapAsync(jobController.detail));
router.get('/:jobId/download', wrapAsync(jobController.download));

export default router;
