import type { Request } from 'express';
import { Router } from 'express';

import validation from '@intake24/api/http/requests/admin/authentication';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminAuthenticationController, rateLimiter } = ioc.cradle;

  const router = Router();

  const loginRateLimiter = rateLimiter.createMiddleware('login', {
    keyGenerator: (req) => `login:${req.body.email ?? req.ip}`,
    message: (req: Request) => req.scope.cradle.i18nService.translate('rateLimit.login'),
    skipSuccessfulRequests: true,
  });

  router.post(
    '/login',
    loginRateLimiter,
    validation.login,
    wrapAsync(adminAuthenticationController.login)
  );
  router.post('/duo', validation.duo, wrapAsync(adminAuthenticationController.verify));
  router.post('/fido', validation.fido, wrapAsync(adminAuthenticationController.verify));
  router.post('/otp', validation.otp, wrapAsync(adminAuthenticationController.verify));
  router.post('/refresh', wrapAsync(adminAuthenticationController.refresh));
  router.post('/logout', wrapAsync(adminAuthenticationController.logout));

  return router;
};
