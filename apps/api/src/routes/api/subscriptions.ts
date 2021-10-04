import { Router } from 'express';
import validation from '@api/http/requests/subscriptions';
import { authenticate } from '@api/http/middleware/acl';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { subscriptionController } = ioc.cradle;

const router = Router();

authenticate(router, 'user');

router
  .route('')
  .post(validation.subscribe, wrapAsync(subscriptionController.subscribe))
  .delete(wrapAsync(subscriptionController.unsubscribe));

router.post('/push', wrapAsync(subscriptionController.push));

export default router;
