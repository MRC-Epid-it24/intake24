import { Request, Response, Router } from 'express';
import authentication from './authentication';
import admin from './admin';
import password from './password';
import feedback from './feedback';
import foods from './foods';
import portionSizes from './portion-sizes';
import subscriptions from './subscriptions';
import surveys from './surveys';
import user from './user';

const router = Router();

router.use('/auth', authentication);
router.use('/password', password);
router.use('/subscriptions', subscriptions);

router.use('/admin', admin);

router.use('/feedback', feedback);
router.use('/foods', foods);
router.use('/portion-sizes', portionSizes);
router.use('/surveys', surveys);
router.use('/user', user);

router.all('*', (req: Request, res: Response): void => {
  res.status(404).json('Route not found.');
});

export default router;
