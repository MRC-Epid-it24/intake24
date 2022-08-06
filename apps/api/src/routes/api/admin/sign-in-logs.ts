import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/sign-in-logs';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { signInLogController } = ioc.cradle;
  const router = Router();

  router.use(permission('sign-in-logs'));

  router
    .route('')
    .get(
      permission('sign-in-logs|browse'),
      validation.browse,
      wrapAsync(signInLogController.browse)
    );

  router.get('/refs', wrapAsync(signInLogController.refs));

  router.use('/:signInLogId', validation.entry('signInLogId'));

  router
    .route('/:signInLogId')
    .get(permission('sign-in-logs|read'), wrapAsync(signInLogController.read))
    .delete(permission('sign-in-logs|delete'), wrapAsync(signInLogController.destroy));

  return router;
};
