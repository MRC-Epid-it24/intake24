import { Router } from 'express';
import validation from '@/http/requests/subscriptions';
import { authenticate } from '@/http/middleware/acl';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { subscriptionController } = ioc.cradle;

const router = Router();

authenticate(router, 'user');

router
  .route('')
  .post(validation.subscribe, wrapAsync(subscriptionController.subscribe))
  .delete(wrapAsync(subscriptionController.unsubscribe));

router.post('/push', wrapAsync(subscriptionController.push));

export default router;
