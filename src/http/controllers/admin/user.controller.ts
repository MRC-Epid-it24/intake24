import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import User from '@/db/models/system/user';
import NotFoundError from '@/http/errors/not-found.error';
import userResponse from '@/http/responses/admin/user-response';
import { roleList } from '@/services/acl.service';
import { hash } from '@/util/passwords';

const entry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const user = await User.scope('roles').findByPk(id);

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
    res.json({ data: { id: null }, refs: {} });
  },

  async store(req: Request, res: Response): Promise<void> {
    const { password } = req.body;

    const user = await User.create({
      ...pick(req.body, [
        'name',
        'email',
        'phone',
        'simpleName',
        'emailNotifications',
        'smsNotifications',
      ]),
      password: await hash(password),
    });

    res.status(201).json({ data: userResponse(user) });
  },

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const user = await User.scope('roles').findByPk(id);

    if (!user) {
      next(new NotFoundError());
      return;
    }

    await user.update(
      pick(req.body, [
        'name',
        'email',
        'phone',
        'simpleName',
        'emailNotifications',
        'smsNotifications',
      ])
    );

    res.json({ data: userResponse(user), refs: { roles: await roleList() } });
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      next(new NotFoundError());
      return;
    }

    await user.destroy();
    res.status(204).json();
  },
};
