import { Request, Response } from 'express';
import { pick } from 'lodash';
import { jobTypes, JobType } from '@common/types';
import { TaskEntry, TaskRefs, TasksResponse } from '@common/types/http/admin';
import { Task, User } from '@api/db/models/system';
import { NotFoundError } from '@api/http/errors';
import type { IoC } from '@api/ioc';
import { PaginateQuery } from '@api/db/models/model';
import { Controller, CrudActions } from '../controller';

export type TaskController = Controller<CrudActions | 'run'>;

export default ({ scheduler }: Pick<IoC, 'scheduler'>): TaskController => {
  const entry = async (
    req: Request<{ taskId: string }>,
    res: Response<TaskEntry>
  ): Promise<void> => {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);
    if (!task) throw new NotFoundError();

    const bullJob = await scheduler.tasks.getRepeatableJobById(taskId.toString());

    res.json({ ...task.get(), bullJob });
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<TasksResponse>
  ): Promise<void> => {
    const tasks = await Task.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name', 'job'],
      order: [['name', 'ASC']],
    });

    res.json(tasks);
  };

  const store = async (req: Request, res: Response<TaskEntry>): Promise<void> => {
    const { name, job, cron, active, description, params } = req.body;

    const task = await Task.create({ name, job, cron, active, description, params });
    await scheduler.tasks.addJob(task);

    res.status(201).json(task);
  };

  const read = async (req: Request<{ taskId: string }>, res: Response<TaskEntry>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request<{ taskId: string }>, res: Response<TaskEntry>): Promise<void> =>
    entry(req, res);

  const update = async (
    req: Request<{ taskId: string }>,
    res: Response<TaskEntry>
  ): Promise<void> => {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);
    if (!task) throw new NotFoundError();

    const { name, job, cron, active, description, params } = req.body;

    await task.update({ name, job, cron, active, description, params });
    await scheduler.tasks.updateJob(task);

    const bullJob = await scheduler.tasks.getRepeatableJobById(taskId.toString());

    res.json({ ...task.get(), bullJob });
  };

  const destroy = async (
    req: Request<{ taskId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);
    if (!task) throw new NotFoundError();

    await task.destroy();
    await scheduler.tasks.removeJob(task);
    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<TaskRefs>): Promise<void> => {
    const jobs: JobType[] = [...jobTypes];
    res.json({ jobs });
  };

  const run = async (req: Request<{ taskId: string }>, res: Response): Promise<void> => {
    const { taskId } = req.params;
    const { id: userId } = req.user as User;

    const task = await Task.findByPk(taskId);
    if (!task) throw new NotFoundError();

    const { job, params } = task;

    await scheduler.jobs.addJob({ userId, type: job }, params, { delay: 500 });

    res.json();
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
    run,
  };
};
