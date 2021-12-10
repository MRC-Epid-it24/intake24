import { Router } from 'express';
import categories from './categories';
import foods from './foods';

const router = Router();

router.use('/categories/:localeId', categories);
router.use('/foods/:localeId', foods);

export default router;
