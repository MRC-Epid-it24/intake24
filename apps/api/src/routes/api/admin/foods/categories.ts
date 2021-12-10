import { Router } from 'express';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { adminCategoryController } = ioc.cradle;
const router = Router({ mergeParams: true });

router.route('').get(wrapAsync(adminCategoryController.browse));
router.route('/:categoryId').get(wrapAsync(adminCategoryController.read));

export default router;
