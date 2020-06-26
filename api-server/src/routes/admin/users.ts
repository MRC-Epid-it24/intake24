import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/user.controller';
import { isSuperUser } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/users';

const router = Router();

router.use(isSuperUser());

router
  .route('')
  .post(validation.store, wrapAsync(controller.store))
  .get(validation.list, wrapAsync(controller.list));

router.get('/create', wrapAsync(controller.create));

router
  .route('/:id')
  .get(validation.entry, wrapAsync(controller.show))
  .put(validation.entry, validation.update, wrapAsync(controller.update))
  .delete(validation.entry, wrapAsync(controller.delete));

router.get('/:id/edit', validation.entry, wrapAsync(controller.edit));

export default router;
