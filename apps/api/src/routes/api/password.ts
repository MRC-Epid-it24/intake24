import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import validation from '@api/http/requests/password';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { config, passwordController } = ioc.cradle;

const router = Router();

const passwordResetLimiter = rateLimit({
  windowMs: config.security.passwords.throttle * 1000,
  max: 1,
  message: 'Password request has just been requested, please try again later.',
});

router.post('', passwordResetLimiter, validation.request, wrapAsync(passwordController.request));
router.post('/reset', validation.reset, wrapAsync(passwordController.reset));

export default router;
