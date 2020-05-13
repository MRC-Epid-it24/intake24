import { Router } from 'express';
import passport from 'passport';
import surveyController from '@/controllers/survey.controller';

const router = Router();

router.get('', surveyController.list);
router.get('/:surveyId', surveyController.publicEntry);

router.get(
  '/:surveyId/parameters',
  passport.authenticate('jwt', { session: false }),
  surveyController.entry
);

router.get(
  '/:surveyId/user-info',
  passport.authenticate('jwt', { session: false }),
  surveyController.userInfo
);

export default router;
