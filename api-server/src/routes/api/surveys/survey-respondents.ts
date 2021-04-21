import { Router } from 'express';
import { authenticate, isSurveyRespondent } from '@/http/middleware/acl';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { surveyRespondentController } = ioc.cradle;

const router = Router({ mergeParams: true });

authenticate(router, 'user');
router.use(isSurveyRespondent());

router.get('/parameters', wrapAsync(surveyRespondentController.parameters));
router.get('/user-info', wrapAsync(surveyRespondentController.userInfo));
router.post('/submissions', wrapAsync(surveyRespondentController.submissions));
router.post('/follow-up', wrapAsync(surveyRespondentController.followUp));
router.post('/request-help', wrapAsync(surveyRespondentController.requestHelp));

export default router;
