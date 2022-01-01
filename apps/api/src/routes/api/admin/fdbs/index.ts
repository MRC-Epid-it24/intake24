import { Router } from 'express';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';
import categories from './categories';
import foods from './foods';

const router = Router();

const { localeController } = ioc.cradle;

router.get('/:localeId', wrapAsync(localeController.read));
router.use('/:localeId/categories', categories);
router.use('/:localeId/foods', foods);

export default router;
