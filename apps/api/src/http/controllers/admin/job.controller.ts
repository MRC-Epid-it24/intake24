import path from 'node:path';

import type { Request, Response } from 'express';
import fs from 'fs-extra';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { JobEntry, JobsResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { Job, Op } from '@intake24/db';

const jobController = ({ fsConfig, scheduler }: Pick<IoC, 'fsConfig' | 'scheduler'>) => {
  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<JobsResponse>
  ): Promise<void> => {
    const jobs = await Job.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['type'],
      order: [['startedAt', 'DESC']],
      attributes: ['id', 'type', 'userId', 'startedAt', 'completedAt', 'successful'],
      include: [{ association: 'user', attributes: ['name', 'email'], required: false }],
    });

    res.json(jobs);
  };

  const read = async (req: Request<{ jobId: string }>, res: Response<JobEntry>): Promise<void> => {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId, {
      include: [{ association: 'user', attributes: ['name', 'email'], required: false }],
    });
    if (!job) throw new NotFoundError();

    res.json(job);
  };

  const destroy = async (
    req: Request<{ jobId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId, { attributes: ['id'] });
    if (!job) throw new NotFoundError();

    await job.destroy();
    res.status(204).json();
  };

  const refs = async (): Promise<void> => {
    throw new NotFoundError();
  };

  const download = async (
    req: Request<{ jobId: string }>,
    res: Response<Buffer>
  ): Promise<void> => {
    const { jobId: id } = req.params;

    const job = await Job.findOne({
      attributes: ['id', 'downloadUrl'],
      where: {
        id,
        downloadUrl: { [Op.ne]: null },
        downloadUrlExpiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!job?.downloadUrl) throw new NotFoundError();
    const { downloadUrl } = job;

    const file = path.resolve(fsConfig.local.downloads, downloadUrl);
    if (!(await fs.pathExists(file))) throw new NotFoundError();

    const { size } = await fs.stat(file);

    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${downloadUrl}`);
    res.set('Content-Length', size.toString());
    fs.createReadStream(file).pipe(res);
  };

  const repeat = async (
    req: Request<{ jobId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId, { attributes: ['id', 'type', 'userId', 'params'] });
    if (!job) throw new NotFoundError();

    const { type, userId, params } = job;

    const jobEntry = await scheduler.jobs.addJob({ type, userId, params });

    res.json(jobEntry);
  };

  return {
    browse,
    read,
    destroy,
    refs,
    download,
    repeat,
  };
};

export default jobController;

export type JobController = ReturnType<typeof jobController>;
