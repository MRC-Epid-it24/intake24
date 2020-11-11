import { NextFunction, Request, Response } from 'express';
import { WhereOptions } from 'sequelize';
import { Job, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';

export default {
  async list(req: Request, res: Response): Promise<void> {
    const user = req.user as User;
    const type = req.query.type as string | string[];

    const where: WhereOptions = { userId: user.id, type };

    const jobs = await Job.findAll({ where });

    res.json(jobs);
  },

  async detail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { jobId: id } = req.params;
    const { id: userId } = req.user as User;

    const job = await Job.findOne({ where: { id, userId } });

    if (!job) {
      next(new NotFoundError());
      return;
    }

    res.json(job);
  },
};
