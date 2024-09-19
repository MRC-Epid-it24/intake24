import type { AppRoute, AppRouter } from '@ts-rest/core';
import type { TsRestRequest } from '@ts-rest/express';
import type { WhereOptions } from 'sequelize';
import { initServer } from '@ts-rest/express';
import { col, fn, Op } from 'sequelize';

import { NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import { customTypeValidationMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { contract } from '@intake24/common/contracts';
import { Task } from '@intake24/db';

async function uniqueMiddleware<T extends AppRoute | AppRouter>(value: any, { taskId, req }: { taskId?: string; req: TsRestRequest<T> }) {
  const where: WhereOptions = taskId ? { id: { [Op.ne]: taskId } } : {};

  if (!(await unique({ model: Task, condition: { field: 'name', value }, options: { where } }))) {
    throw new ValidationError(customTypeValidationMessage('unique._', { req, path: 'name' }), {
      path: 'name',
    });
  }
}

export function task() {
  return initServer().router(contract.admin.task, {
    browse: {
      middleware: [permission('tasks', 'tasks|browse')],
      handler: async ({ query }) => {
        const tasks = await Task.paginate({
          query,
          columns: ['name', 'job'],
          order: [[fn('lower', col('name')), 'ASC']],
        });

        return { status: 200, body: tasks };
      },
    },
    store: {
      middleware: [permission('tasks', 'tasks|create')],
      handler: async ({ body, req }) => {
        await uniqueMiddleware(body.name, { req });

        const task = await Task.create(body);
        await req.scope.cradle.scheduler.tasks.addJob(task);

        return { status: 201, body: task };
      },
    },
    read: {
      middleware: [permission('tasks', 'tasks|read')],
      handler: async ({ params: { taskId }, req }) => {
        const task = await Task.findByPk(taskId);
        if (!task)
          throw new NotFoundError();

        const bullJob = await req.scope.cradle.scheduler.tasks.getRepeatableJobById(taskId);

        return { status: 200, body: { ...task.get(), bullJob } };
      },
    },
    update: {
      middleware: [permission('tasks', 'tasks|edit')],
      handler: async ({ body, params: { taskId }, req }) => {
        await uniqueMiddleware(body.name, { taskId, req });

        const task = await Task.findByPk(taskId);
        if (!task)
          throw new NotFoundError();

        await task.update(body);
        await req.scope.cradle.scheduler.tasks.updateJob(task);

        const bullJob = await req.scope.cradle.scheduler.tasks.getRepeatableJobById(taskId);

        return { status: 200, body: { ...task.get(), bullJob } };
      },
    },
    destroy: {
      middleware: [permission('tasks', 'tasks|delete')],
      handler: async ({ params: { taskId }, req }) => {
        const task = await Task.findByPk(taskId, { attributes: ['id'] });
        if (!task)
          throw new NotFoundError();

        await task.destroy();
        await req.scope.cradle.scheduler.tasks.removeJob(task);

        return { status: 204, body: undefined };
      },
    },
    run: {
      middleware: [permission('tasks', 'tasks|edit')],
      handler: async ({ params: { taskId }, req }) => {
        const { userId } = req.scope.cradle.user;

        const task = await Task.findByPk(taskId, { attributes: ['id', 'job', 'params'] });
        if (!task)
          throw new NotFoundError();

        const { job, params } = task;

        const jobEntry = await req.scope.cradle.scheduler.jobs.addJob(
          { userId, type: job, params },
          { delay: 500 },
        );

        return { status: 200, body: jobEntry };
      },
    },
  });
}
