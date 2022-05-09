import { Router } from 'express';
import validation from '@intake24/api/http/requests/admin/authentication';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminAuthenticationController, rateLimiter } = ioc.cradle;

  const router = Router();

  const loginRateLimiter = rateLimiter.createMiddleware('login', {
    message: 'Too many failed login attempts, please try again later.',
    skipSuccessfulRequests: true,
  });

  router.post(
    '/login',
    loginRateLimiter,
    validation.login,
    wrapAsync(adminAuthenticationController.login)
  );
  router.post('/verify', validation.mfaVerify, wrapAsync(adminAuthenticationController.verify));
  router.post('/refresh', wrapAsync(adminAuthenticationController.refresh));
  router.post('/logout', wrapAsync(adminAuthenticationController.logout));

  return router;
};
