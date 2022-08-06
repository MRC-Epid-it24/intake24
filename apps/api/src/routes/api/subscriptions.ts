import { Router } from 'express';

import { authenticate } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/subscriptions';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { subscriptionController } = ioc.cradle;

  const router = Router();

  authenticate(router, 'survey');

  router
    .route('')
    .post(validation.subscribe, wrapAsync(subscriptionController.subscribe))
    .delete(wrapAsync(subscriptionController.unsubscribe));

  router.post('/push', wrapAsync(subscriptionController.push));

  return router;
};
