import { Router } from 'express';
import passport from 'passport';
import validation from '@/http/requests/subscriptions';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { subscriptionController } = ioc.cradle;

const router = Router();

router.use(passport.authenticate('user', { session: false }));

router
  .route('')
  .post(validation.subscribe, wrapAsync(subscriptionController.subscribe))
  .delete(wrapAsync(subscriptionController.unsubscribe));

router.post('/push', wrapAsync(subscriptionController.push));

export default router;
