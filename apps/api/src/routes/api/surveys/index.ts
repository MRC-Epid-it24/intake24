import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';
import validation from '@api/http/requests/surveys';
import surveyRespondents from './survey-respondents';

const { environment, surveyController } = ioc.cradle;

const router = Router();

const generateUserLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: environment === 'test' ? 100 : 1,
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

export default router;
