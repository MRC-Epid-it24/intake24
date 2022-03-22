import { Router } from 'express';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';
import validation from '@intake24/api/http/requests/surveys';
import surveyRespondents from './survey-respondents';

export default () => {
  const { rateLimiter, surveyController } = ioc.cradle;

  const router = Router();

  const generateUserLimiter = rateLimiter.createMiddleware('generateUser', {
    message: 'New user has just been generated, please try again later.',
  });

  router.get('', wrapAsync(surveyController.browse));
  router.get('/:surveyId', wrapAsync(surveyController.entry));
  router.post(
    '/:surveyId/generate-user',
    generateUserLimiter,
    validation.generateUser,
    wrapAsync(surveyController.generateUser)
  );
  router.post(
    '/:surveyId/create-user',
    validation.createUser,
    wrapAsync(surveyController.createUser)
  );

  router.use('/:surveyId', surveyRespondents);

  return router;
};
