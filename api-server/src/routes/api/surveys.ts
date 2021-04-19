import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';
import validation from '@/http/requests/surveys';
import surveyRespondent from './survey-respondent';

const { surveyController } = ioc.cradle;

const router = Router();

const generateUserLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
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
router.post('/:surveyId/create-user', wrapAsync(surveyController.createUser));

router.use('/:surveyId', surveyRespondent);

export default router;
