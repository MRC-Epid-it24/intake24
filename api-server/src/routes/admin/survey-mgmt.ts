import { Router } from 'express';
import controller from '@/http/controllers/admin/survey-mgmt.controller';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/users/mgmt';
import { wrapAsync } from '@/util';

const router = Router({ mergeParams: true });

router.use(permission('surveys-edit'));

router.get('', validation.list, wrapAsync(controller.list));
router.get('/available', wrapAsync(controller.available));
router.put('/:userId', validation.update, wrapAsync(controller.update));

export default router;
