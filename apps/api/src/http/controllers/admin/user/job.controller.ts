import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { Op, WhereOptions } from 'sequelize';
import { JobResponse, JobsResponse } from '@common/types/http/admin';
import { JobAttributes } from '@common/types/models';
import { Job, User } from '@api/db/models/system';
import { NotFoundError } from '@api/http/errors';
import type { IoC } from '@api/ioc';
import type { Controller } from '@api/http/controllers';

export type UserJobController = Controller<'browse' | 'read' | 'download'>;

export default ({ fsConfig }: Pick<IoC, 'fsConfig'>): UserJobController => {
  const browse = async (req: Request, res: Response<JobsResponse>): Promise<void> => {
    const user = req.user as User;
    const { type } = req.query;

    const where: WhereOptions<JobAttributes> = {
      userId: user.id,
      downloadUrlExpiresAt: { [Op.or]: [null, { [Op.gt]: new Date() }] },
    };

    if (type) where.type = type;

    const jobs = await Job.paginate({ req, where, order: [['startedAt', 'DESC']] });

    res.json(jobs);
  };

  const read = async (req: Request, res: Response<JobResponse>): Promise<void> => {
    const { jobId: id } = req.params;
    const { id: userId } = req.user as User;

    const job = await Job.findOne({ where: { id, userId } });

    if (!job) throw new NotFoundError();

    res.json({ data: job });
  };

  const download = async (req: Request, res: Response<Buffer>): Promise<void> => {
    const { jobId: id } = req.params;
    const { id: userId } = req.user as User;

    const job = await Job.findOne({
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
