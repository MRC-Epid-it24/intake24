import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/feedback-schemes';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

import securables from './securables';

export default () => {
  const { feedbackSchemeController } = ioc.cradle;
  const router = Router();

  router.use(permission('feedback-schemes'));

  router
    .route('')
    .post(
      permission('feedback-schemes|create'),
      validation.store,
      wrapAsync(feedbackSchemeController.store)
    )
    .get(validation.browse, wrapAsync(feedbackSchemeController.browse));

  router.get('/refs', wrapAsync(feedbackSchemeController.refs));

  router.use('/:feedbackSchemeId', validation.entry('feedbackSchemeId'));

  router
    .route('/:feedbackSchemeId')
    .get(wrapAsync(feedbackSchemeController.read))
    .patch(validation.patch, wrapAsync(feedbackSchemeController.patch))
    .put(
      permission('feedback-schemes|edit'),
      validation.put,
      wrapAsync(feedbackSchemeController.put)
    )
    .delete(wrapAsync(feedbackSchemeController.destroy));

  router.get('/:feedbackSchemeId/edit', wrapAsync(feedbackSchemeController.edit));
  router.post('/:feedbackSchemeId/copy', validation.copy, wrapAsync(feedbackSchemeController.copy));

  router.use(
    '/:feedbackSchemeId/securables',
    securables('FeedbackScheme', feedbackSchemeController.securables)
  );

  return router;
};
