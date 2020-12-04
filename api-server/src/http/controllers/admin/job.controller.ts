import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { Op } from 'sequelize';
import config from '@/config/filesystem';
import { Job, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import { JobResponse, JobsResponse } from '@common/types/http/admin/jobs';

export default {
  async list(req: Request, res: Response<JobsResponse>): Promise<void> {
    const user = req.user as User;
    // TODO: validate type
    const type = req.query.type as string | string[];

    const jobs = await Job.paginate({
      req,
      where: {
        userId: user.id,
        type,
        downloadUrlExpiresAt: { [Op.or]: { [Op.eq]: null, [Op.gt]: new Date() } },
      },
      order: [['started_at', 'DESC']],
    });

    res.json(jobs);
  },

  async detail(req: Request, res: Response<JobResponse>): Promise<void> {
    const { jobId: id } = req.params;
    const { id: userId } = req.user as User;

    const job = await Job.findOne({ where: { id, userId } });

    if (!job) throw new NotFoundError();

    res.json({ data: job });
  },

  async download(req: Request, res: Response<Buffer>): Promise<void> {
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

    if (!job) throw new NotFoundError();

    const file = path.resolve(config.local.downloads, job.downloadUrl);
    if (!(await fs.pathExists(file))) throw new NotFoundError();

    const { size } = await fs.stat(file);

    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${job.downloadUrl}`);
    res.set('Content-Length', size.toString());
    fs.createReadStream(file).pipe(res);
  },
};
