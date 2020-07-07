import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/user.controller';
import { isSuperUser } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/users/generic';

const router = Router();

router.use(isSuperUser());

router
  .route('')
  .post(validation.store, wrapAsync(controller.store))
  .get(validation.list, wrapAsync(controller.list));

router.get('/create', wrapAsync(controller.create));

router
  .route('/:userId')
  .get(validation.entry('userId'), wrapAsync(controller.show))
  .put(validation.entry('userId'), validation.update, wrapAsync(controller.update))
  .delete(validation.entry('userId'), wrapAsync(controller.delete));

router.get('/:userId/edit', validation.entry('userId'), wrapAsync(controller.edit));

export default router;
