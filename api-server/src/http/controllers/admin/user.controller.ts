import { Request, Response } from 'express';
import { pick } from 'lodash';
import { Permission, Role, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import userResponse from '@/http/responses/admin/user.response';
import userSvc from '@/services/user.service';
import {
  CreateUserResponse,
  UserResponse,
  UserRefs,
  UsersResponse,
  StoreUserResponse,
} from '@common/types/http/admin/users';

const entryRefs = async (): Promise<UserRefs> => {
  const permissions = await Permission.scope('list').findAll();
  const roles = await Role.scope('list').findAll();

  return { permissions, roles };
};

const entry = async (req: Request, res: Response<UserResponse>): Promise<void> => {
  const { userId } = req.params;
  const user = await User.scope(['permissions', 'roles']).findByPk(userId);

  if (!user) throw new NotFoundError();

  const data = userResponse(user);
  const refs = await entryRefs();

  res.json({ data, refs });
};

export default {
  async list(req: Request, res: Response<UsersResponse>): Promise<void> {
    const users = await User.scope('roles').paginate({
      req,
      columns: ['name', 'email', 'simpleName'],
    });

    res.json(users);
  },

  async create(req: Request, res: Response<CreateUserResponse>): Promise<void> {
    const refs = await entryRefs();

    res.json({ refs });
  },

  async store(req: Request, res: Response<StoreUserResponse>): Promise<void> {
    const user = await userSvc.create(
      pick(req.body, [
        'name',
        'email',
        'phone',
        'emailNotifications',
        'smsNotifications',
        'multiFactorAuthentication',
        'password',
        'permissions',
        'roles',
      ])
    );

    const data = userResponse(
      (await User.scope(['permissions', 'roles']).findByPk(user.id)) as User
    );

    res.status(201).json({ data });
  },

  async detail(req: Request, res: Response<UserResponse>): Promise<void> {
    entry(req, res);
  },

  async edit(req: Request, res: Response<UserResponse>): Promise<void> {
    entry(req, res);
  },

  async update(req: Request, res: Response<UserResponse>): Promise<void> {
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
        'permissions',
        'roles',
      ])
    );

    const data = userResponse(
      (await User.scope(['permissions', 'roles']).findByPk(userId)) as User
    );
    const refs = await entryRefs();

    res.json({ data, refs });
  },

  async delete(req: Request, res: Response<undefined>): Promise<void> {
    const { userId } = req.params;

    await userSvc.delete(userId);
    res.status(204).json();
  },
};
