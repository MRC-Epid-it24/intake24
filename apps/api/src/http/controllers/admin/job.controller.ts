import { Request, Response } from 'express';
import fs from 'fs-extra';
import { pick } from 'lodash';
import path from 'path';
import { Op } from 'sequelize';
import { JobResponse, JobsResponse } from '@common/types/http/admin';
import { Job, User } from '@api/db/models/system';
import { NotFoundError } from '@api/http/errors';
import type { IoC } from '@api/ioc';
import type { PaginateQuery } from '@api/db/models/model';
import type { Controller } from '../controller';

export type JobController = Controller<'browse' | 'read' | 'destroy' | 'download'>;

export default ({ fsConfig }: Pick<IoC, 'fsConfig'>): JobController => {
  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<JobsResponse>
  ): Promise<void> => {
    const jobs = await Job.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['type'],
      order: [['startedAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email'], required: false }],
    });

    res.json(jobs);
  };

  const read = async (req: Request, res: Response<JobResponse>): Promise<void> => {
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
    read,
    destroy,
    download,
  };
};
