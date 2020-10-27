import { Router } from 'express';
import { wrapAsync } from '@/util';
import controller from '@/http/controllers/admin/task.controller';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/tasks';

const router = Router();

router
  .route('')
  .post(permission('tasks-create'), validation.store, wrapAsync(controller.store))
  .get(permission('tasks-list'), validation.list, wrapAsync(controller.list));

router.get('/create', permission('tasks-create'), wrapAsync(controller.create));

router
  .route('/:taskId')
  .get(permission('tasks-detail'), wrapAsync(controller.detail))
  .put(permission('tasks-edit'), validation.update, wrapAsync(controller.update))
  .delete(permission('tasks-delete'), wrapAsync(controller.delete));

router.get('/:taskId/edit', permission('tasks-edit'), wrapAsync(controller.edit));

export default router;
