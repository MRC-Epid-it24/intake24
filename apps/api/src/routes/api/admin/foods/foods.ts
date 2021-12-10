import { Router } from 'express';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { adminFoodController } = ioc.cradle;
const router = Router({ mergeParams: true });

router.route('').get(wrapAsync(adminFoodController.browse));
router.route('/:foodId').get(wrapAsync(adminFoodController.read));

export default router;
