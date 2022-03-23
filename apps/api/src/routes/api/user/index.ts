import { Router } from 'express';
import { authenticate } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/user';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';
import physicalData from './physical-data';
import submissions from './submissions';

export default () => {
  const { userProfileController } = ioc.cradle;

  const router = Router();

  authenticate(router, 'user');

  router.post(
    '/password',
    validation.updatePassword,
    wrapAsync(userProfileController.updatePassword)
  );

  router.use('/physical-data', physicalData());
  router.use('/submissions', submissions());

  return router;
};
