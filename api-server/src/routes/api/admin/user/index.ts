import { Router } from 'express';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';
import jobs from './jobs';

const router = Router();

const { userProfileController } = ioc.cradle;

router.get('', wrapAsync(userProfileController.index));

router.use('/jobs', jobs);

export default router;
