import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/locale.controller';
import { canManageFoodDatabase } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/locales';

const router = Router();

router.route('').get(validation.list, canManageFoodDatabase(), wrapAsync(controller.list));

router.route('/:id').get(validation.entry, canManageFoodDatabase(), wrapAsync(controller.show));

export default router;
