import { Router } from 'express';
import validation from '@/http/requests/admin/jobs';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { jobController } = ioc.cradle;
const router = Router();

router.route('').get(validation.browse, wrapAsync(jobController.browse));
router.route('/:jobId').get(wrapAsync(jobController.detail));
router.get('/:jobId/download', wrapAsync(jobController.download));

export default router;
