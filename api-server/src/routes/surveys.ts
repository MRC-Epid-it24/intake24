import { Router } from 'express';
import passport from 'passport';
import surveyController from '@/http/controllers/survey.controller';
import { isSurveyRespondent } from '@/http/middleware/acl';
import wrapAsync from '@/util/wrap-async';

const router = Router();

router.get('', wrapAsync(surveyController.list));
router.get('/:surveyId', wrapAsync(surveyController.publicEntry));
router.post('/:surveyId/generate-user', wrapAsync(surveyController.generateUser));

router.get(
  '/:surveyId/parameters',
  passport.authenticate('jwt', { session: false }),
  isSurveyRespondent(),
  wrapAsync(surveyController.entry)
);

router.get(
  '/:surveyId/user-info',
  passport.authenticate('jwt', { session: false }),
  isSurveyRespondent(),
  wrapAsync(surveyController.userInfo)
);

export default router;
