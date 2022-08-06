import { Router } from 'express';

import validation from '@intake24/api/http/requests/user/feedback';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { rateLimiter, userFeedbackController } = ioc.cradle;

  const feedbackRateLimiter = rateLimiter.createMiddleware('feedback', {
    message: 'You have recently requested the feedback output, please try again later.',
    skipFailedRequests: true,
  });

  const router = Router();

  router.use(feedbackRateLimiter);

  router
    .route('')
    .get(validation.download, wrapAsync(userFeedbackController.download))
    .post(validation.email, wrapAsync(userFeedbackController.email));

  return router;
};
