import { Router } from 'express';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';
import jobs from './jobs';

const router = Router();

const { adminUserProfileController } = ioc.cradle;

router.get('', wrapAsync(adminUserProfileController.index));

router.use('/jobs', jobs);

export default router;
