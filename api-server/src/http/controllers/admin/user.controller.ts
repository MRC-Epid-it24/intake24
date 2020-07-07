import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import User from '@/db/models/system/user';
import NotFoundError from '@/http/errors/not-found.error';
import userResponse from '@/http/responses/admin/user.response';
import { roleList } from '@/services/acl.service';
import userSvc from '@/services/user.service';

const entry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params;
  const user = await User.scope('roles').findByPk(userId);

  if (!user) {
    next(new NotFoundError());
    return;
  }

  res.json({ data: userResponse(user), refs: { roles: await roleList() } });
};

export default {
  async list(req: Request, res: Response): Promise<void> {
    const { data, meta } = await User.scope('roles').paginate({
      req,
      columns: ['name', 'email', 'simpleName'],
    });

    res.json({ data, meta });
  },

  async create(req: Request, res: Response): Promise<void> {
    res.json({ data: { id: null }, refs: { roles: await roleList() } });
  },

  async store(req: Request, res: Response): Promise<void> {
    const user = await userSvc.create(
      pick(req.body, [
        'name',
        'email',
        'phone',
        'emailNotifications',
        'smsNotifications',
        'multiFactorAuthentication',
        'password',
        'roles',
      ])
    );

    res.status(201).json({
      data: userResponse((await User.scope('roles').findByPk(user.id)) as User),
    });
  },

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async update(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    await userSvc.update(
      userId,
      pick(req.body, [
        'name',
        'email',
        'phone',
        'emailNotifications',
        'smsNotifications',
        'multiFactorAuthentication',
        'roles',
      ])
    );

    res.json({
      data: userResponse((await User.scope('roles').findByPk(userId)) as User),
      refs: { roles: await roleList() },
    });
  },

  async delete(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    await userSvc.delete(userId);
    res.status(204).json();
  },
};
