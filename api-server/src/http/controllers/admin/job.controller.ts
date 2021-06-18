import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { Op } from 'sequelize';
import { Job, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { JobResponse, JobsResponse } from '@common/types/http/admin';
import type { Controller } from '../controller';

export type JobController = Controller<'browse' | 'detail' | 'destroy' | 'download'>;

export default ({ fsConfig }: Pick<IoC, 'fsConfig'>): JobController => {
  const browse = async (req: Request, res: Response<JobsResponse>): Promise<void> => {
    const jobs = await Job.paginate({
      req,
      columns: ['type'],
      order: [['completedAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email'], required: false }],
    });

    res.json(jobs);
  };

  const detail = async (req: Request, res: Response<JobResponse>): Promise<void> => {
    const { jobId } = req.params;
    const job = await Job.findByPk(jobId, {
      include: [{ model: User, attributes: ['name', 'email'], required: false }],
    });

    if (!job) throw new NotFoundError();

    res.json({ data: job });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { jobId } = req.params;
    const job = await Job.findByPk(jobId);

    if (!job) throw new NotFoundError();

    await job.destroy();
    res.status(204).json();
  };

  const download = async (req: Request, res: Response<Buffer>): Promise<void> => {
    const { jobId: id } = req.params;

    const job = await Job.findOne({
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

  return {
    browse,
    detail,
    destroy,
    download,
  };
};
