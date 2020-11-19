import { Request, Response } from 'express';
import { Task } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import jobsDefs from '@/jobs';
import { JobType } from '@/jobs/job';
import scheduler from '@/services/scheduler';
import {
  CreateTaskResponse,
  StoreTaskResponse,
  TaskResponse,
  TasksResponse,
} from '@common/types/http/admin/tasks';

const jobs = Object.keys(jobsDefs) as JobType[];

const entry = async (req: Request, res: Response<TaskResponse>): Promise<void> => {
  const { taskId } = req.params;
  const task = await Task.findByPk(taskId);

  if (!task) throw new NotFoundError();

  res.json({ data: task, refs: { jobs } });
};

export default {
  async list(req: Request, res: Response<TasksResponse>): Promise<void> {
    const tasks = await Task.paginate({ req, columns: ['name', 'job'] });

    res.json(tasks);
  },

  async create(req: Request, res: Response<CreateTaskResponse>): Promise<void> {
    res.json({ refs: { jobs } });
  },

  async store(req: Request, res: Response<StoreTaskResponse>): Promise<void> {
    const { name, job, cron, active, description } = req.body;

    const task = await Task.create({ name, job, cron, active, description });
    await scheduler.tasks.addJob(task);

    res.status(201).json({ data: task });
  },

  async detail(req: Request, res: Response<TaskResponse>): Promise<void> {
    entry(req, res);
  },

  async edit(req: Request, res: Response<TaskResponse>): Promise<void> {
    entry(req, res);
  },

  async update(req: Request, res: Response<TaskResponse>): Promise<void> {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);

    if (!task) throw new NotFoundError();

    const { name, job, cron, active, description } = req.body;

    await task.update({ name, job, cron, active, description });
    await scheduler.tasks.updateJob(task);

    res.json({ data: task, refs: { jobs } });
  },

  async delete(req: Request, res: Response<undefined>): Promise<void> {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);

    if (!task) throw new NotFoundError();

    await task.destroy();
    await scheduler.tasks.removeJob(task);
    res.status(204).json();
  },

  async run(req: Request, res: Response): Promise<void> {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);

    if (!task) throw new NotFoundError();

    scheduler.tasks.runJob(task);

    res.json();
  },
};
