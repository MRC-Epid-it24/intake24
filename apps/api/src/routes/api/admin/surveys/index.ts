import { Router } from 'express';
import multer from 'multer';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/surveys';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

import securables from '../securables';
import surveyRespondents from './survey-respondents';
import surveySubmissions from './survey-submissions';

export default () => {
  const { adminSurveyController, fsConfig } = ioc.cradle;
  const router = Router();
  const upload = multer({ dest: fsConfig.local.uploads });

  router.use(permission('surveys'));

  router
    .route('')
    .post(permission('surveys|create'), validation.store, wrapAsync(adminSurveyController.store))
    .get(validation.browse, wrapAsync(adminSurveyController.browse));

  router.get('/refs', wrapAsync(adminSurveyController.refs));

  router.use('/:surveyId', validation.entry('surveyId'));

  router
    .route('/:surveyId')
    .get(wrapAsync(adminSurveyController.read))
    .patch(validation.patch, wrapAsync(adminSurveyController.patch))
    .put(permission('surveys|edit'), validation.put, wrapAsync(adminSurveyController.put))
    .delete(wrapAsync(adminSurveyController.destroy));

  router.get('/:surveyId/edit', wrapAsync(adminSurveyController.edit));

  router.use('/:surveyId/respondents', surveyRespondents());
  router.use('/:surveyId/submissions', surveySubmissions());
  router.post(
    '/:surveyId/tasks',
    upload.single('params[file]'),
    validation.tasks,
    wrapAsync(adminSurveyController.tasks)
  );

  router.use('/:surveyId/securables', securables('Survey', adminSurveyController.securables));

  return router;
};
