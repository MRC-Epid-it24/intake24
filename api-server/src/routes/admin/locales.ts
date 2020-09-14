import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/locale.controller';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/locales';

const router = Router();

router.route('').get(validation.list, permission('locales-list'), wrapAsync(controller.list));

router
  .route('/:localeId')
  .get(validation.entry, permission('locales-detail'), wrapAsync(controller.detail));

export default router;
