import { Router } from 'express';
import ms from 'ms';

import type { User } from '@intake24/db/models';
import { authenticate, isSurveyRespondent } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/surveys';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { rateLimiter, surveyRespondentController } = ioc.cradle;

  const router = Router({ mergeParams: true });

  authenticate(router, 'survey');
  router.use(isSurveyRespondent());

  router.get('/parameters', wrapAsync(surveyRespondentController.parameters));
  router.get('/user-info', validation.userInfo, wrapAsync(surveyRespondentController.userInfo));
  router
    .route('/session')
    .post(validation.setSession, wrapAsync(surveyRespondentController.setSession))
    .get(wrapAsync(surveyRespondentController.getSession))
    .delete(wrapAsync(surveyRespondentController.clearSession));
  router.post(
    '/submission',
    validation.submission,
    wrapAsync(surveyRespondentController.submission)
  );
  router.post(
    '/request-help',
    validation.requestHelp,
    wrapAsync(surveyRespondentController.requestHelp)
  );

  const ratingRateLimiter = rateLimiter.createGenericMiddleware('rating', {
    message: 'You have recently sent feedback.',
    skipFailedRequests: true,
    keyGenerator: (req) => {
      const identifier = (req.user as User | undefined)?.id ?? req.ip;
      const type = typeof req.body.type === 'string' ? `rating-${req.body.type}` : 'rating';
      return `${type}:${identifier}`;
    },
    windowMs: ms('15m'),
    limit: 1,
  });

  router.post(
    '/rating',
    ratingRateLimiter,
    validation.rating,
    wrapAsync(surveyRespondentController.rating)
  );

  return router;
};
