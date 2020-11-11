import { NextFunction, Request, Response } from 'express';
import { Job, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import { JobResponse, JobsResponse } from '@common/types/http/admin/jobs';

export default {
  async list(req: Request, res: Response<JobsResponse>): Promise<void> {
    const user = req.user as User;
    const type = req.query.type as string | string[];

    const jobs = await Job.paginate({ req, where: { userId: user.id, type } });

    res.json(jobs);
  },

  async detail(req: Request, res: Response<JobResponse>, next: NextFunction): Promise<void> {
    const { jobId: id } = req.params;
    const { id: userId } = req.user as User;

    const job = await Job.findOne({ where: { id, userId } });

    if (!job) {
      next(new NotFoundError());
      return;
    }

    res.json({ data: job });
  },
};
