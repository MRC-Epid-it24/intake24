import { Router } from 'express';
import validation from '@intake24/api/http/requests/password';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { passwordController, rateLimiter } = ioc.cradle;

  const router = Router();

  const passwordResetLimiter = rateLimiter.createMiddleware('password', {
    message: 'Password request has just been requested, please try again later.',
    skipFailedRequests: true,
  });

  router.post('', passwordResetLimiter, validation.request, wrapAsync(passwordController.request));
  router.post('/reset', validation.reset, wrapAsync(passwordController.reset));

  return router;
};
