import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import config from '@/config/security';
import controller from '@/http/controllers/password.controller';
import validation from '@/http/requests/password';
import { wrapAsync } from '@/util';

const router = Router();

const passwordResetLimiter = rateLimit({
  windowMs: config.passwords.throttle * 1000,
  max: 1,
  message: 'Password request has just been requested, please try again later.',
});

router.post('', passwordResetLimiter, validation.request, wrapAsync(controller.request));
router.post('/reset', validation.reset, wrapAsync(controller.reset));

export default router;
