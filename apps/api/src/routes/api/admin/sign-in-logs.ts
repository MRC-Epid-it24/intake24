import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/sign-in-logs';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { signInLogController } = ioc.cradle;
const router = Router();

router
  .route('')
  .get(permission('sign-in-logs|browse'), validation.browse, wrapAsync(signInLogController.browse));

router.get(
  '/refs',
  anyPermission(['sign-in-logs|create', 'sign-in-logs|read', 'sign-in-logs|edit']),
  wrapAsync(signInLogController.refs)
);

router
  .route('/:signInLogId')
  .get(
    permission('sign-in-logs|read'),
    validation.entry('signInLogId'),
    wrapAsync(signInLogController.read)
  )
  .delete(
    permission('sign-in-logs|delete'),
    validation.entry('signInLogId'),
    wrapAsync(signInLogController.destroy)
  );

export default router;
