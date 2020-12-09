import { Request, Response, Router } from 'express';
import authentication from './authentication';
import admin from './admin';
import password from './password';
import feedback from './feedback';
import foods from './foods';
import portionSize from './portion-size';
import surveys from './surveys';

const router = Router();

router.use(authentication);
router.use('/password', password);

router.use('/admin', admin);

router.use('/feedback', feedback);
router.use('/foods', foods);
router.use('/portion-size', portionSize);
router.use('/surveys', surveys);

router.all('*', (req: Request, res: Response): void => {
  res.status(404).json('Route not found.');
});

export default router;
