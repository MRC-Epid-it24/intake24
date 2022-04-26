import { Router } from 'express';
import validation from '@intake24/api/http/requests/user';
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
    .get(validation.downloadFeedback, wrapAsync(userFeedbackController.download))
    .post(validation.emailFeedback, wrapAsync(userFeedbackController.email));

  return router;
};
