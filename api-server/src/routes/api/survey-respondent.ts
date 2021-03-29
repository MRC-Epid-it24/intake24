import { Router } from 'express';
import passport from 'passport';
import { isSurveyRespondent } from '@/http/middleware/acl';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { surveyController } = ioc.cradle;

const router = Router({ mergeParams: true });

router.use(passport.authenticate('user', { session: false }));
router.use(isSurveyRespondent());

router.get('/parameters', wrapAsync(surveyController.parameters));
router.get('/user-info', wrapAsync(surveyController.userInfo));
router.get('/request-help', wrapAsync(surveyController.requestHelp));
router.post('/submissions', wrapAsync(surveyController.submissions));

export default router;
