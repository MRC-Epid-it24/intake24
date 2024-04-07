import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/survey-scheme-prompts';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { surveySchemePromptController } = ioc.cradle;
  const router = Router();

  router.use(permission('survey-scheme-prompts'));

  router
    .route('')
    .post(
      permission('survey-scheme-prompts|create'),
      validation.store,
      wrapAsync(surveySchemePromptController.store),
    )
    .get(
      permission('survey-scheme-prompts|browse'),
      validation.browse,
      wrapAsync(surveySchemePromptController.browse),
    );

  router.get('/refs', wrapAsync(surveySchemePromptController.refs));

  router.use('/:surveySchemePromptId', validation.entry('surveySchemePromptId'));

  router
    .route('/:surveySchemePromptId')
    .get(permission('survey-scheme-prompts|read'), wrapAsync(surveySchemePromptController.read))
    .put(
      permission('survey-scheme-prompts|edit'),
      validation.update,
      wrapAsync(surveySchemePromptController.update),
    )
    .delete(
      permission('survey-scheme-prompts|delete'),
      wrapAsync(surveySchemePromptController.destroy),
    );

  router.get(
    '/:surveySchemePromptId/edit',
    permission('survey-scheme-prompts|edit'),
    wrapAsync(surveySchemePromptController.edit),
  );

  router.post(
    '/:surveySchemePromptId/sync',
    permission('survey-scheme-prompts|sync'),
    validation.sync,
    wrapAsync(surveySchemePromptController.sync),
  );

  return router;
};
