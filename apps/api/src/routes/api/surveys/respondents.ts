import { Router } from 'express';

import { authenticate, isSurveyRespondent } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/surveys';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { surveyRespondentController } = ioc.cradle;

  const router = Router({ mergeParams: true });

  authenticate(router, 'survey');
  router.use(isSurveyRespondent());

  router.get('/parameters', wrapAsync(surveyRespondentController.parameters));
  router.get('/user-info', validation.userInfo, wrapAsync(surveyRespondentController.userInfo));
  router
    .route('/session')
    .post(validation.setSession, wrapAsync(surveyRespondentController.setSession))
    .get(wrapAsync(surveyRespondentController.getSession))
    .delete(wrapAsync(surveyRespondentController.clearSession));
  router.post(
    '/submission',
    validation.submission,
    wrapAsync(surveyRespondentController.submission)
  );
  router.post(
    '/request-help',
    validation.requestHelp,
    wrapAsync(surveyRespondentController.requestHelp)
  );

  return router;
};
