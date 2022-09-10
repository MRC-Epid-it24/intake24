import { Router } from 'express';

import validation from '@intake24/api/http/requests/surveys';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

import respondents from './respondents';

export default () => {
  const { rateLimiter, surveyController } = ioc.cradle;

  const router = Router();

  const generateUserLimiter = rateLimiter.createMiddleware('generateUser', {
    message: 'New user has just been generated, please try again later.',
    skipFailedRequests: true,
  });

  router.get('', wrapAsync(surveyController.browse));
  router.get('/:slug', wrapAsync(surveyController.entry));
  router.post(
    '/:slug/generate-user',
    generateUserLimiter,
    validation.generateUser,
    wrapAsync(surveyController.generateUser)
  );
  router.post('/:slug/create-user', validation.createUser, wrapAsync(surveyController.createUser));

  router.use('/:slug', respondents());

  return router;
};
