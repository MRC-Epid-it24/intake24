import { Router } from 'express';
import guided from './guided';

const router = Router();

router.use('/guided', guided);

export default router;
