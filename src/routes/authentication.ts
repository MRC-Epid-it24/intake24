import { Router } from 'express';
import controller from '@/http/controllers/authentication.controller';
import validation from '@/http/requests/authentication';
import { wrapAsync } from '@/util';

const router = Router();

router.post('/login', validation.emaiLogin, wrapAsync(controller.emailLogin));
router.post('/login/alias', validation.aliasLogin, wrapAsync(controller.aliasLogin));
router.post('/login/token', wrapAsync(controller.tokenLogin));
router.post('/login/verify', wrapAsync(controller.verify));
router.post('/refresh', wrapAsync(controller.refresh));
router.post('/logout', wrapAsync(controller.logout));

export default router;
