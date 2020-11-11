import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/job.controller';

const router = Router();

router.route('').get(wrapAsync(controller.list));
router.route('/:jobId').get(wrapAsync(controller.detail));

export default router;
