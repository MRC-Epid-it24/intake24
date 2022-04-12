import { Router } from 'express';
import multer from 'multer';
import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/surveys/respondents';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { fsConfig, adminSurveyRespondentController } = ioc.cradle;
  const router = Router({ mergeParams: true });
  const upload = multer({ dest: fsConfig.local.uploads });

  router.use(permission('surveys|respondents'));

  router
    .route('')
    .post(validation.store, wrapAsync(adminSurveyRespondentController.store))
    .get(validation.browse, wrapAsync(adminSurveyRespondentController.browse));

  router.post(
    '/upload',
    upload.single('file'),
    validation.upload,
    wrapAsync(adminSurveyRespondentController.upload)
  );
  router.post('/export-auth-urls', wrapAsync(adminSurveyRespondentController.exportAuthUrls));

  router.use('/:userId', validation.entry('userId'));

  router
    .route('/:userId')
    .get(wrapAsync(adminSurveyRespondentController.read))
    .patch(validation.update, wrapAsync(adminSurveyRespondentController.update))
    .delete(wrapAsync(adminSurveyRespondentController.destroy));

  router.get('/:userId/edit', wrapAsync(adminSurveyRespondentController.edit));

  router
    .route('/:userId/feedback')
    .get(wrapAsync(adminSurveyRespondentController.downloadFeedback))
    .post(validation.emailFeedback, wrapAsync(adminSurveyRespondentController.emailFeedback));

  return router;
};
