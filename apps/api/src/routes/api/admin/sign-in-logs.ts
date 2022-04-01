import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/sign-in-logs';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { signInLogController } = ioc.cradle;
  const router = Router();

  router
    .route('')
    .get(
      permission('sign-in-logs|browse'),
      validation.browse,
      wrapAsync(signInLogController.browse)
    );

  router.get(
    '/refs',
    anyPermission(['sign-in-logs|create', 'sign-in-logs|read', 'sign-in-logs|edit']),
    wrapAsync(signInLogController.refs)
  );

  router.use('/:signInLogId', validation.entry('signInLogId'));

  router
    .route('/:signInLogId')
    .get(permission('sign-in-logs|read'), wrapAsync(signInLogController.read))
    .delete(permission('sign-in-logs|delete'), wrapAsync(signInLogController.destroy));

  return router;
};
