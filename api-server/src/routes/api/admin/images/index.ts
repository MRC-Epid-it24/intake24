import { Router } from 'express';
import guides from './guides';
import maps from './maps';

const router = Router();

router.use('/guides', guides);
router.use('/maps', maps);

export default router;
