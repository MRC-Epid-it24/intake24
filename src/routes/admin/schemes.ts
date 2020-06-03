import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/scheme.controller';
import { canManageSurvey } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/schemes';

const router = Router();

router.use(canManageSurvey());

router
  .route('')
  .post(validation.store, wrapAsync(controller.store))
  .get(validation.list, wrapAsync(controller.list));

router.get('/create', wrapAsync(controller.create));

router
  .route('/:id')
  .get(wrapAsync(controller.show))
  .put(validation.update, wrapAsync(controller.update))
  .delete(wrapAsync(controller.delete));

router.get('/:id/edit', wrapAsync(controller.edit));

export default router;
