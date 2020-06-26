import { Router } from 'express';
import controller from '@/http/controllers/password.controller';
import validation from '@/http/requests/password';
import { wrapAsync } from '@/util';

const router = Router();

router.post('', validation.request, wrapAsync(controller.request));
router.post('/reset', validation.reset, wrapAsync(controller.reset));

export default router;
