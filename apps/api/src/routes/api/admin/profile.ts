import { Router } from 'express';

import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const router = Router();

  const { adminUserProfileController, rateLimiter } = ioc.cradle;

  const verifyRateLimiter = rateLimiter.createMiddleware('password', {
    message: 'Email verification link has been recently requested, please try again later.',
    skipFailedRequests: true,
  });

  router.get('', wrapAsync(adminUserProfileController.index));
  router.post('/verify', verifyRateLimiter, wrapAsync(adminUserProfileController.verify));

  return router;
};
