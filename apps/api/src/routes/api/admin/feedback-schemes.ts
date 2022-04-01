import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/feedback-schemes';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { feedbackSchemeController } = ioc.cradle;
  const router = Router();

  router
    .route('')
    .post(
      permission('feedback-schemes|create'),
      validation.store,
      wrapAsync(feedbackSchemeController.store)
    )
    .get(
      permission('feedback-schemes|browse'),
      validation.browse,
      wrapAsync(feedbackSchemeController.browse)
    );

  router.get(
    '/refs',
    anyPermission(['feedback-schemes|create', 'feedback-schemes|read', 'feedback-schemes|edit']),
    wrapAsync(feedbackSchemeController.refs)
  );

  router.post(
    '/copy',
    permission('feedback-schemes|edit'),
    validation.copy,
    wrapAsync(feedbackSchemeController.copy)
  );

  router.use('/:feedbackSchemeId', validation.entry('feedbackSchemeId'));

  router
    .route('/:feedbackSchemeId')
    .get(permission('feedback-schemes|read'), wrapAsync(feedbackSchemeController.read))
    .put(
      permission('feedback-schemes|edit'),
      validation.update,
      wrapAsync(feedbackSchemeController.update)
    )
    .delete(permission('feedback-schemes|delete'), wrapAsync(feedbackSchemeController.destroy));

  router.get(
    '/:feedbackSchemeId/edit',
    permission('feedback-schemes|edit'),
    wrapAsync(feedbackSchemeController.edit)
  );

  return router;
};
