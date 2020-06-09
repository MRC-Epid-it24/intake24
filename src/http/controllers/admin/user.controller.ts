import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import { Op } from 'sequelize';
import User from '@/db/models/system/user';
import NotFoundError from '@/http/errors/not-found.error';
import userResponse from '@/http/responses/admin/user-response';
import { roleList } from '@/services/acl.service';
import UserRole from '@/db/models/system/user-role';
import {defaultAlgorithm} from "@/util/passwords";
import UserPassword from "@/db/models/system/user-password";

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
    res.json({ data: { id: null }, refs: { roles: await roleList() } });
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
        'multiFactorAuthentication',
      ])
    });

    const { id } = user;
    const { roles } = req.body;
    const newRoles = roles.map((role: string) => ({ userId: id, role }));
    await UserRole.bulkCreate(newRoles);

    const hashedPassword = await defaultAlgorithm.hash(password);
    UserPassword.create({ userId: id, passwordSalt: hashedPassword.salt, passwordHash: hashedPassword.hash, passwordHasher: defaultAlgorithm.id } );

    res.status(201).json({ data: userResponse((await User.scope('roles').findByPk(id)) as User) });
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
        'multiFactorAuthentication',
      ])
    );

    const currentRoles = user.roles?.map((item) => item.role) ?? [];
    const { roles: newRoles } = req.body;
    await UserRole.destroy({ where: { userId: id, role: { [Op.notIn]: newRoles } } });

    const roleRecords = newRoles
      .filter((role: string) => !currentRoles.includes(role))
      .map((role: string) => ({ userId: id, role }));

    if (roleRecords.length) await UserRole.bulkCreate(roleRecords);

    res.json({
      data: userResponse((await User.scope('roles').findByPk(id)) as User),
      refs: { roles: await roleList() },
    });
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
