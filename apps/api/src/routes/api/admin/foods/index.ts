import { Router } from 'express';
import categories from './categories';
import foods from './foods';

const router = Router();

router.use('/:localeId/categories', categories);
router.use('/:localeId/foods', foods);

export default router;
