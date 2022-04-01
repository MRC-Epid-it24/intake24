import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/tasks';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { taskController } = ioc.cradle;
  const router = Router();

  router
    .route('')
    .post(permission('tasks|create'), validation.store, wrapAsync(taskController.store))
    .get(permission('tasks|browse'), validation.browse, wrapAsync(taskController.browse));

  router.get(
    '/refs',
    anyPermission(['tasks|create', 'tasks|read', 'tasks|edit']),
    wrapAsync(taskController.refs)
  );

  router.use('/:taskId', validation.entry('taskId'));

  router
    .route('/:taskId')
    .get(permission('tasks|read'), wrapAsync(taskController.read))
    .put(permission('tasks|edit'), validation.update, wrapAsync(taskController.update))
    .delete(permission('tasks|delete'), wrapAsync(taskController.destroy));

  router.get('/:taskId/edit', permission('tasks|edit'), wrapAsync(taskController.edit));

  router.post('/:taskId/run', permission('tasks|edit'), wrapAsync(taskController.run));

  return router;
};
