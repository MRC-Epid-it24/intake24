import { Router } from 'express';

import validation from '@intake24/api/http/requests/authentication';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { authenticationController, rateLimiter } = ioc.cradle;

  const router = Router();

  const loginRateLimiter = rateLimiter.createMiddleware('login', {
    message: 'Too many failed login attempts, please try again later.',
    skipSuccessfulRequests: true,
  });

  router.post(
    '/login',
    loginRateLimiter,
    validation.emailLogin,
    wrapAsync(authenticationController.emailLogin)
  );
  router.post(
    '/login/alias',
    loginRateLimiter,
    validation.aliasLogin,
    wrapAsync(authenticationController.aliasLogin)
  );
  router.post('/login/token', loginRateLimiter, wrapAsync(authenticationController.tokenLogin));
  router.post('/refresh', wrapAsync(authenticationController.refresh));
  router.post('/logout', wrapAsync(authenticationController.logout));

  return router;
};
