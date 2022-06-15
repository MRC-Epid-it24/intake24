import type { Request, Response } from 'express';
import { pick } from 'lodash';
import type { UserEntry, UserRefs, UsersResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { Permission, Role, User } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { userEntryResponse } from '@intake24/api/http/responses/admin';
import type { IoC } from '@intake24/api/ioc';
import type { Controller, CrudActions } from '@intake24/api/http/controllers';

export type AdminUserController = Controller<CrudActions>;

export default ({ adminUserService }: Pick<IoC, 'adminUserService'>): AdminUserController => {
  const entry = async (
    req: Request<{ userId: string }>,
    res: Response<UserEntry>
  ): Promise<void> => {
    const { userId } = req.params;

    const user = await User.scope(['aliases', 'customFields', 'permissions', 'roles']).findByPk(
      userId
    );
    if (!user) throw new NotFoundError();

    res.json(userEntryResponse(user));
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<UsersResponse>
  ): Promise<void> => {
    const users = await User.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name', 'email', 'simpleName'],
      include: [{ model: Role }],
      order: [['name', 'ASC']],
    });

    res.json(users);
  };

  const store = async (req: Request, res: Response<UserEntry>): Promise<void> => {
    const user = await adminUserService.create(
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

    res.status(201).json(data);
  };

  const read = async (req: Request<{ userId: string }>, res: Response<UserEntry>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request<{ userId: string }>, res: Response<UserEntry>): Promise<void> =>
    entry(req, res);

  const update = async (
    req: Request<{ userId: string }>,
    res: Response<UserEntry>
  ): Promise<void> => {
    const { userId } = req.params;

    await adminUserService.update(
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

    res.json(data);
  };

  const destroy = async (
    req: Request<{ userId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { userId } = req.params;

    await adminUserService.destroy(userId);
    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<UserRefs>): Promise<void> => {
    const [permissions, roles] = await Promise.all([
      Permission.scope('list').findAll({ order: [['name', 'ASC']] }),
      Role.scope('list').findAll({ order: [['name', 'ASC']] }),
    ]);

    res.json({ permissions, roles });
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
  };
};
