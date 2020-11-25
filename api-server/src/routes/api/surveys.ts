import { Router } from 'express';
import surveyController from '@/http/controllers/survey.controller';
import { wrapAsync } from '@/util';
import surveyRespondent from './survey-respondent';

const router = Router();

router.get('', wrapAsync(surveyController.list));
router.get('/:surveyId', wrapAsync(surveyController.entry));
router.post('/:surveyId/generate-user', wrapAsync(surveyController.generateUser));
router.post('/:surveyId/create-user', wrapAsync(surveyController.createUser));

router.use('/:surveyId', surveyRespondent);

export default router;
