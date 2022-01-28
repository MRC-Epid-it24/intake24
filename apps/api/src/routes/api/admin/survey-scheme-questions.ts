import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/survey-scheme-questions';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { surveySchemeQuestionController } = ioc.cradle;
const router = Router();

router
  .route('')
  .post(
    permission('survey-scheme-questions|create'),
    validation.store,
    wrapAsync(surveySchemeQuestionController.store)
  )
  .get(
    permission('survey-scheme-questions|browse'),
    validation.browse,
    wrapAsync(surveySchemeQuestionController.browse)
  );

router.get(
  '/refs',
  anyPermission([
    'survey-scheme-questions|create',
    'survey-scheme-questions|read',
    'survey-scheme-questions|edit',
  ]),
  wrapAsync(surveySchemeQuestionController.refs)
);

router.use('/:surveySchemeQuestionId', validation.entry('surveySchemeQuestionId'));

router
  .route('/:surveySchemeQuestionId')
  .get(permission('survey-scheme-questions|read'), wrapAsync(surveySchemeQuestionController.read))
  .put(
    permission('survey-scheme-questions|edit'),
    validation.update,
    wrapAsync(surveySchemeQuestionController.update)
  )
  .delete(
    permission('survey-scheme-questions|delete'),
    wrapAsync(surveySchemeQuestionController.destroy)
  );

router.get(
  '/:surveySchemeQuestionId/edit',
  permission('survey-scheme-questions|edit'),
  wrapAsync(surveySchemeQuestionController.edit)
);

router.post(
  '/:surveySchemeQuestionId/sync',
  permission('survey-scheme-questions|sync'),
  validation.sync,
  wrapAsync(surveySchemeQuestionController.sync)
);

export default router;
