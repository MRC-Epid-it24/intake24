import { Router } from 'express';
import { permission } from '@api/http/middleware/acl';
import validation from '@api/http/requests/admin/sign-in-logs';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { signInLogController } = ioc.cradle;
const router = Router();

router
  .route('')
  .get(permission('sign-in-logs-browse'), validation.browse, wrapAsync(signInLogController.browse));

router
  .route('/:signInLogId')
  .get(
    permission('sign-in-logs-read'),
    validation.entry('signInLogId'),
    wrapAsync(signInLogController.read)
  )
  .delete(
    permission('sign-in-logs-delete'),
    validation.entry('signInLogId'),
    wrapAsync(signInLogController.destroy)
  );

export default router;
