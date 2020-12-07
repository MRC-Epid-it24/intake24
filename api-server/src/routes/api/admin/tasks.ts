import { Router } from 'express';
import { permission } from '@/http/middleware/acl';
import validation from '@/http/requests/admin/tasks';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { taskController } = ioc.cradle;
const router = Router();

router
  .route('')
  .post(permission('tasks-create'), validation.store, wrapAsync(taskController.store))
  .get(permission('tasks-list'), validation.list, wrapAsync(taskController.list));

router.get('/create', permission('tasks-create'), wrapAsync(taskController.create));

router
  .route('/:taskId')
  .get(permission('tasks-detail'), wrapAsync(taskController.detail))
  .put(permission('tasks-edit'), validation.update, wrapAsync(taskController.update))
  .delete(permission('tasks-delete'), wrapAsync(taskController.destroy));

router.get('/:taskId/edit', permission('tasks-edit'), wrapAsync(taskController.edit));

export default router;
