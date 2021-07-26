import { Request, Response } from 'express';
import { Task, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { jobTypes, JobType } from '@common/types';
import {
  CreateTaskResponse,
  StoreTaskResponse,
  TaskResponse,
  TasksResponse,
} from '@common/types/http/admin';
import { Controller, CrudActions } from '../controller';

export type TaskController = Controller<CrudActions | 'run'>;

export default ({ scheduler }: Pick<IoC, 'scheduler'>): TaskController => {
  const jobs: JobType[] = [...jobTypes];

  const entry = async (
    req: Request<{ taskId: number }>,
    res: Response<TaskResponse>
  ): Promise<void> => {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);
    if (!task) throw new NotFoundError();

    const bullJob = await scheduler.tasks.getRepeatableJobById(taskId.toString());

    res.json({ data: task, bullJob, refs: { jobs } });
  };

  const browse = async (req: Request, res: Response<TasksResponse>): Promise<void> => {
    const tasks = await Task.paginate({ req, columns: ['name', 'job'], order: [['name', 'ASC']] });

    res.json(tasks);
  };

  const create = async (req: Request, res: Response<CreateTaskResponse>): Promise<void> => {
    res.json({ refs: { jobs } });
  };

  const store = async (req: Request, res: Response<StoreTaskResponse>): Promise<void> => {
    const { name, job, cron, active, description, params } = req.body;

    const task = await Task.create({ name, job, cron, active, description, params });
    await scheduler.tasks.addJob(task);

    res.status(201).json({ data: task });
  };

  const read = async (
    req: Request<{ taskId: number }>,
    res: Response<TaskResponse>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ taskId: number }>,
    res: Response<TaskResponse>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ taskId: number }>,
    res: Response<TaskResponse>
  ): Promise<void> => {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);
    if (!task) throw new NotFoundError();

    const { name, job, cron, active, description, params } = req.body;

    await task.update({ name, job, cron, active, description, params });
    await scheduler.tasks.updateJob(task);

    const bullJob = await scheduler.tasks.getRepeatableJobById(taskId.toString());

    res.json({ data: task, bullJob, refs: { jobs } });
  };

  const destroy = async (
    req: Request<{ taskId: number }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);
    if (!task) throw new NotFoundError();

    await task.destroy();
    await scheduler.tasks.removeJob(task);
    res.status(204).json();
  };

  const run = async (req: Request<{ taskId: number }>, res: Response): Promise<void> => {
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
    create,
    store,
    read,
    edit,
    update,
    destroy,
    run,
  };
};
