import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/job.controller';
import validation from '@/http/requests/admin/jobs';

const router = Router();

router.route('').get(validation.list, wrapAsync(controller.list));
router.route('/:jobId').get(wrapAsync(controller.detail));
router.get('/:jobId/download', wrapAsync(controller.download));

export default router;
