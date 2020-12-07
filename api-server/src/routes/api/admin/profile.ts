import { Router } from 'express';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { profileController } = ioc.cradle;
const router = Router();

router.get('', wrapAsync(profileController.index));

export default router;
