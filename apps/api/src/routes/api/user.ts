import { Router } from 'express';
import { authenticate } from '@api/http/middleware/acl';
import validation from '@api/http/requests/user';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { userController } = ioc.cradle;

const router = Router();

authenticate(router, 'user');

router.post('/password', validation.updatePassword, wrapAsync(userController.updatePassword));

router
  .route('/physical-data')
  .get(wrapAsync(userController.getPhysicalData))
  .post(validation.physicalData, wrapAsync(userController.setPhysicalData));

router.get('/submissions', validation.submissions, wrapAsync(userController.submissions));

export default router;
