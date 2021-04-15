import { Router } from 'express';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';
import validation from '@/http/requests/surveys';
import surveyRespondent from './survey-respondent';

const { surveyController } = ioc.cradle;

const router = Router();

router.get('', wrapAsync(surveyController.browse));
router.get('/:surveyId', wrapAsync(surveyController.entry));
router.post(
  '/:surveyId/generate-user',
  validation.generateUser,
  wrapAsync(surveyController.generateUser)
);
router.post('/:surveyId/create-user', wrapAsync(surveyController.createUser));

router.use('/:surveyId', surveyRespondent);

export default router;
