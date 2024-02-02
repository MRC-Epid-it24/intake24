import path from 'node:path';

import type { Request, Response } from 'express';
import fs from 'fs-extra';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { JobEntry, JobsResponse } from '@intake24/common/types/http/admin';
import type { JobAttributes, PaginateQuery, WhereOptions } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { Job, Op } from '@intake24/db';

const adminUserJobController = ({ fsConfig }: Pick<IoC, 'fsConfig'>) => {
  const browse = async (
    req: Request<any, any, any, PaginateQuery & { type?: string }>,
    res: Response<JobsResponse>
  ): Promise<void> => {
    const { userId } = req.scope.cradle.user;
    const { type } = req.query;

    const where: WhereOptions<JobAttributes> = { userId };
    if (type) where.type = type;

    const jobs = await Job.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['type'],
      where,
      order: [['startedAt', 'DESC']],
    });

    res.json(jobs);
  };

  const read = async (req: Request, res: Response<JobEntry>): Promise<void> => {
    const { jobId: id } = req.params;
    const { userId } = req.scope.cradle.user;

    const job = await Job.findOne({ where: { id, userId } });
    if (!job) throw new NotFoundError();

    res.json(job);
  };

  const download = async (req: Request, res: Response<Buffer>): Promise<void> => {
    const { jobId: id } = req.params;
    const { userId } = req.scope.cradle.user;

    const job = await Job.findOne({
      attributes: ['id', 'downloadUrl'],
      where: {
        id,
        userId,
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
    download,
  };
};

export default adminUserJobController;

export type AdminUserJobController = ReturnType<typeof adminUserJobController>;
