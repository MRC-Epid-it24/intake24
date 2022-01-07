import { Router } from 'express';
import { authenticate } from '@api/http/middleware/acl';
import validation from '@api/http/requests/user';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';
import physicalData from './physical-data';
import submissions from './submissions';

const { userProfileController } = ioc.cradle;

const router = Router();

authenticate(router, 'user');

router.post(
  '/password',
  validation.updatePassword,
  wrapAsync(userProfileController.updatePassword)
);

router.use('/physical-data', physicalData);
router.use('/submissions', submissions);

export default router;
