import { Router } from 'express';
import { authenticate } from '@intake24/api/http/middleware';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { feedbackController } = ioc.cradle;

  const router = Router();

  authenticate(router, 'survey');

  router.get('/', wrapAsync(feedbackController.data));
  return router;
};
