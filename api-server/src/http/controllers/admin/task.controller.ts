import { Request, Response } from 'express';
import { Task } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import jobsDefs, { JobType } from '@/jobs';
import {
  CreateTaskResponse,
  StoreTaskResponse,
  TaskResponse,
  TasksResponse,
} from '@common/types/http';
import { Controller, CrudActions } from '../controller';

export type TaskController = Controller<CrudActions | 'run'>;

export default ({ scheduler }: Pick<IoC, 'scheduler'>): TaskController => {
  const jobs = Object.keys(jobsDefs) as JobType[];

  const entry = async (req: Request, res: Response<TaskResponse>): Promise<void> => {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);

    if (!task) throw new NotFoundError();

    res.json({ data: task, refs: { jobs } });
  };

  const browse = async (req: Request, res: Response<TasksResponse>): Promise<void> => {
    const tasks = await Task.paginate({ req, columns: ['name', 'job'], order: [['name', 'ASC']] });

    res.json(tasks);
  };

  const create = async (req: Request, res: Response<CreateTaskResponse>): Promise<void> => {
    res.json({ refs: { jobs } });
  };

  const store = async (req: Request, res: Response<StoreTaskResponse>): Promise<void> => {
    const { name, job, cron, active, description } = req.body;

    const task = await Task.create({ name, job, cron, active, description });
    await scheduler.tasks.addJob(task);

    res.status(201).json({ data: task });
  };

  const detail = async (req: Request, res: Response<TaskResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<TaskResponse>): Promise<void> => entry(req, res);

  const update = async (req: Request, res: Response<TaskResponse>): Promise<void> => {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);

    if (!task) throw new NotFoundError();

    const { name, job, cron, active, description } = req.body;

    await task.update({ name, job, cron, active, description });
    await scheduler.tasks.updateJob(task);

    res.json({ data: task, refs: { jobs } });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);

    if (!task) throw new NotFoundError();

    await task.destroy();
    await scheduler.tasks.removeJob(task);
    res.status(204).json();
  };

  const run = async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);

    if (!task) throw new NotFoundError();

    scheduler.tasks.runJob(task);

    res.json();
  };

  return {
    browse,
    create,
    store,
    detail,
    edit,
    update,
    destroy,
    run,
  };
};
