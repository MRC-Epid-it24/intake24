import { Request, Response } from 'express';
import { pick } from 'lodash';
import { Permission, Role, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import { userEntryResponse } from '@/http/responses/admin';
import type { IoC } from '@/ioc';
import {
  CreateUserResponse,
  UserResponse,
  UserRefs,
  UsersResponse,
  StoreUserResponse,
} from '@common/types/http';
import { Controller, CrudActions } from '../controller';

export type UserController = Controller<CrudActions>;

export default ({ userService }: Pick<IoC, 'userService'>): UserController => {
  const entryRefs = async (): Promise<UserRefs> => {
    const permissions = await Permission.scope('list').findAll();
    const roles = await Role.scope('list').findAll();

    return { permissions, roles };
  };

  const entry = async (req: Request, res: Response<UserResponse>): Promise<void> => {
    const { userId } = req.params;
    const user = await User.scope(['aliases', 'customFields', 'permissions', 'roles']).findByPk(
      userId
    );

    if (!user) throw new NotFoundError();

    const data = userEntryResponse(user);
    const refs = await entryRefs();

    res.json({ data, refs });
  };

  const browse = async (req: Request, res: Response<UsersResponse>): Promise<void> => {
    const users = await User.paginate({
      req,
      columns: ['name', 'email', 'simpleName'],
      include: [{ model: Role }],
      order: [['name', 'ASC']],
    });

    res.json(users);
  };

  const create = async (req: Request, res: Response<CreateUserResponse>): Promise<void> => {
    const refs = await entryRefs();

    res.json({ refs });
  };

  const store = async (req: Request, res: Response<StoreUserResponse>): Promise<void> => {
    const user = await userService.create(
      pick(req.body, [
        'name',
        'email',
        'phone',
        'emailNotifications',
        'smsNotifications',
        'multiFactorAuthentication',
        'password',
        'customFields',
        'permissions',
        'roles',
      ])
    );

    const data = userEntryResponse(
      (await User.scope(['aliases', 'customFields', 'permissions', 'roles']).findByPk(
        user.id
      )) as User
    );

    res.status(201).json({ data });
  };

  const detail = async (req: Request, res: Response<UserResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<UserResponse>): Promise<void> => entry(req, res);

  const update = async (req: Request, res: Response<UserResponse>): Promise<void> => {
    const { userId } = req.params;

    await userService.update(
      userId,
      pick(req.body, [
        'name',
        'email',
        'phone',
        'emailNotifications',
        'smsNotifications',
        'multiFactorAuthentication',
        'customFields',
        'permissions',
        'roles',
      ])
    );

    const data = userEntryResponse(
      (await User.scope(['aliases', 'customFields', 'permissions', 'roles']).findByPk(
        userId
      )) as User
    );
    const refs = await entryRefs();

    res.json({ data, refs });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { userId } = req.params;

    await userService.destroy(userId);
    res.status(204).json();
  };

  return {
    browse,
    create,
    store,
    detail,
    edit,
    update,
    destroy,
  };
};
