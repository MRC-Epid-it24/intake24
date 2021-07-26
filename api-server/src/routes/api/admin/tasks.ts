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
  .get(permission('tasks-browse'), validation.browse, wrapAsync(taskController.browse));

router.get('/create', permission('tasks-create'), wrapAsync(taskController.create));

router
  .route('/:taskId')
  .get(permission('tasks-read'), validation.entry('taskId'), wrapAsync(taskController.read))
  .put(
    permission('tasks-edit'),
    validation.entry('taskId'),
    validation.update,
    wrapAsync(taskController.update)
  )
  .delete(
    permission('tasks-delete'),
    validation.entry('taskId'),
    wrapAsync(taskController.destroy)
  );

router.get(
  '/:taskId/edit',
  validation.entry('taskId'),
  permission('tasks-edit'),
  wrapAsync(taskController.edit)
);

router.post(
  '/:taskId/run',
  permission('tasks-edit'),
  validation.entry('taskId'),
  wrapAsync(taskController.run)
);

export default router;
