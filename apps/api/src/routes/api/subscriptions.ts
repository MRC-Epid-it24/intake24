import { Router } from 'express';
import validation from '@intake24/api/http/requests/subscriptions';
import { authenticate } from '@intake24/api/http/middleware/acl';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { subscriptionController } = ioc.cradle;

const router = Router();

authenticate(router, 'user');

router
  .route('')
  .post(validation.subscribe, wrapAsync(subscriptionController.subscribe))
  .delete(wrapAsync(subscriptionController.unsubscribe));

router.post('/push', wrapAsync(subscriptionController.push));

export default router;
