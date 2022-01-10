import { Router } from 'express';
import { authenticate } from '@intake24/api/http/middleware/acl';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { feedbackController } = ioc.cradle;

const router = Router();

authenticate(router, 'user');

router.get('/henry-coefficients', wrapAsync(feedbackController.henryCoefficients));
router.get('/physical-activity-levels', wrapAsync(feedbackController.physicalActivityLevels));
router.get('/weight-targets', wrapAsync(feedbackController.weightTargets));

export default router;
