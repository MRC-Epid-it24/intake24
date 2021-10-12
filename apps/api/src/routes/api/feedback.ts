import { Router } from 'express';
import { authenticate } from '@api/http/middleware/acl';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { feedbackController } = ioc.cradle;

const router = Router();

authenticate(router, 'user');

router.get('/henry-coefficients', wrapAsync(feedbackController.henryCoefficients));
router.get('/physical-activity-levels', wrapAsync(feedbackController.physicalActivityLevels));
router.get('/weight-targets', wrapAsync(feedbackController.weightTargets));

export default router;
