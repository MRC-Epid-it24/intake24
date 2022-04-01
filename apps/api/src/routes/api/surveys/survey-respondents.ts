import { Router } from 'express';
import { authenticate, isSurveyRespondent } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/surveys';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { surveyRespondentController } = ioc.cradle;

  const router = Router({ mergeParams: true });

  authenticate(router, 'user');
  router.use(isSurveyRespondent());

  router.get('/parameters', wrapAsync(surveyRespondentController.parameters));
  router.get('/user-info', validation.userInfo, wrapAsync(surveyRespondentController.userInfo));
  router.get('/session', wrapAsync(surveyRespondentController.getSession));
  router.post('/session', validation.setSession, wrapAsync(surveyRespondentController.setSession));
  router.post('/submissions', wrapAsync(surveyRespondentController.submissions));
  router.get('/follow-up', wrapAsync(surveyRespondentController.followUp));
  router.post('/request-help', wrapAsync(surveyRespondentController.requestHelp));
  return router;
};
