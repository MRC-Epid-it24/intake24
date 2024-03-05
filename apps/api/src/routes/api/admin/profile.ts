import type { Request } from 'express';
import { Router } from 'express';

import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const router = Router();

  const { adminUserProfileController, rateLimiter } = ioc.cradle;

  const verifyRateLimiter = rateLimiter.createMiddleware('verify', {
    message: (req: Request) => req.scope.cradle.i18nService.translate('rateLimit.verify'),
    skipFailedRequests: true,
  });

  router.get('', wrapAsync(adminUserProfileController.index));
  router.post('/verify', verifyRateLimiter, wrapAsync(adminUserProfileController.verify));

  return router;
};
