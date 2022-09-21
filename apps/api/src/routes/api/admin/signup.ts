import { Router } from 'express';

import validation from '@intake24/api/http/requests/admin/signup';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminSignupController } = ioc.cradle;

  const router = Router();

  router.post('', validation.signUp, wrapAsync(adminSignupController.signUp));
  router.post('/verify', validation.verify, wrapAsync(adminSignupController.verify));

  return router;
};
