import type { Request, Response } from 'express';
import { pick } from 'lodash';
import { col, fn } from 'sequelize';

import type { IoC } from '@intake24/api/ioc';
import type {
  PermissionEntry,
  PermissionsResponse,
  RolesResponse,
  UsersResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { Permission, Role, User } from '@intake24/db';

const permissionController = ({ adminUserService }: Pick<IoC, 'adminUserService'>) => {
  const entry = async (
    req: Request<{ permissionId: string }>,
    res: Response<PermissionEntry>
  ): Promise<void> => {
    const { permissionId } = req.params;

    const permission = await Permission.findByPk(permissionId);
    if (!permission) throw new NotFoundError();

    res.json(permission);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<PermissionsResponse>
  ): Promise<void> => {
    const permissions = await Permission.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name', 'displayName'],
      order: [[fn('lower', col('name')), 'ASC']],
    });

    res.json(permissions);
  };

  const store = async (req: Request, res: Response<PermissionEntry>): Promise<void> => {
    const { name, displayName, description } = req.body;

    const [permission] = await Promise.all([
      Permission.create({ name, displayName, description }),
      adminUserService.flushSuperuserACLCache(),
    ]);

    res.status(201).json(permission);
  };

  const read = async (
    req: Request<{ permissionId: string }>,
    res: Response<PermissionEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ permissionId: string }>,
    res: Response<PermissionEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ permissionId: string }>,
    res: Response<PermissionEntry>
  ): Promise<void> => {
    const { permissionId } = req.params;

    const permission = await Permission.findByPk(permissionId);
    if (!permission) throw new NotFoundError();

    const { displayName, description } = req.body;
    await permission.update({ displayName, description });

    res.json(permission);
  };

  const destroy = async (
    req: Request<{ permissionId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { permissionId } = req.params;

    const permission = await Permission.findByPk(permissionId);
    if (!permission) throw new NotFoundError();

    await permission.destroy();
    res.status(204).json();
  };

  const refs = async (): Promise<void> => {
    throw new NotFoundError();
  };

  const roles = async (
    req: Request<{ permissionId: string }, any, any, PaginateQuery>,
    res: Response<RolesResponse>
  ): Promise<void> => {
    const { permissionId } = req.params;

    const permission = await Permission.findByPk(permissionId);
    if (!permission) throw new NotFoundError();

    const roles = await Role.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name', 'displayName'],
      include: [
        { association: 'permissionLinks', attributes: ['permissionId'], where: { permissionId } },
      ],
      order: [['name', 'ASC']],
    });

    res.json(roles);
  };

  const users = async (
    req: Request<{ permissionId: string }, any, any, PaginateQuery>,
    res: Response<UsersResponse>
  ): Promise<void> => {
    const { permissionId } = req.params;

    const permission = await Permission.findByPk(permissionId);
    if (!permission) throw new NotFoundError();

    const users = await User.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name', 'email', 'simpleName'],
      include: [
        { association: 'permissionLinks', attributes: ['permissionId'], where: { permissionId } },
      ],
      order: [['name', 'ASC']],
    });

    res.json(users);
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
    roles,
    users,
  };
};

export default permissionController;

export type PermissionController = ReturnType<typeof permissionController>;
