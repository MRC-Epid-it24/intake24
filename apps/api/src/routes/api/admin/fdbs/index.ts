import { Router } from 'express';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';
import { canManageFoodDatabase, permission } from '@api/http/middleware/acl';
import categories from './categories';
import foods from './foods';

const router = Router();

const { adminFoodDatabaseController } = ioc.cradle;

router.get('', permission('fdbs-browse'), wrapAsync(adminFoodDatabaseController.browse));

router.use('/:localeId', canManageFoodDatabase());

router.get('/:localeId', permission('fdbs-read'), wrapAsync(adminFoodDatabaseController.read));
router.use('/:localeId/categories', categories);
router.use('/:localeId/foods', foods);

export default router;
