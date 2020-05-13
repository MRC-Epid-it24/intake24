import { Router } from 'express';
import passport from 'passport';
import surveyController from '@/http/controllers/survey.controller';
import { isSurveyRespondent } from '@/http/middleware/acl';

const router = Router();

router.get('', surveyController.list);
router.get('/:surveyId', surveyController.publicEntry);

router.get(
  '/:surveyId/parameters',
  passport.authenticate('jwt', { session: false }),
  isSurveyRespondent(),
  surveyController.entry
);

router.get(
  '/:surveyId/user-info',
  isSurveyRespondent(),
  passport.authenticate('jwt', { session: false }),
  surveyController.userInfo
);

export default router;
