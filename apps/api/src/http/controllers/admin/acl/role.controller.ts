import { Request, Response } from 'express';
import {
  CreateRoleResponse,
  RoleResponse,
  RolesResponse,
  StoreRoleResponse,
} from '@common/types/http/admin';
import { Permission, Role } from '@api/db/models/system';
import { NotFoundError } from '@api/http/errors';
import { roleEntryResponse } from '@api/http/responses/admin';
import type { IoC } from '@api/ioc';
import type { Controller, CrudActions } from '@api/http/controllers';
import { PaginateQuery } from '@api/db/models/model';
import { pick } from 'lodash';

export type RoleController = Controller<CrudActions>;

export default ({ aclConfig }: Pick<IoC, 'aclConfig'>): RoleController => {
  const entry = async (req: Request, res: Response<RoleResponse>): Promise<void> => {
    const { roleId } = req.params;

    const role = await Role.scope('permissions').findByPk(roleId);
    if (!role) throw new NotFoundError();

    const data = roleEntryResponse(role);
    const permissions = await Permission.scope('list').findAll();

    res.json({ data, refs: { permissions } });
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<RolesResponse>
  ): Promise<void> => {
    const roles = await Role.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name', 'displayName'],
      order: [['name', 'ASC']],
    });

    res.json(roles);
  };

  const create = async (req: Request, res: Response<CreateRoleResponse>): Promise<void> => {
    const permissions = await Permission.scope('list').findAll();

    res.json({ refs: { permissions } });
  };

  const store = async (req: Request, res: Response<StoreRoleResponse>): Promise<void> => {
    const { name, displayName, description, permissions } = req.body;
    const role = await Role.create({ name, displayName, description });
    await role.$set('permissions', permissions);

    await role.reload({ include: [{ model: Permission }] });
    const data = roleEntryResponse(role);

    res.status(201).json({ data });
  };

  const read = async (req: Request, res: Response<RoleResponse>): Promise<void> => entry(req, res);

  const edit = async (req: Request, res: Response<RoleResponse>): Promise<void> => entry(req, res);

  const update = async (req: Request, res: Response<RoleResponse>): Promise<void> => {
    const { roleId } = req.params;

    const role = await Role.scope('permissions').findByPk(roleId);
    if (!role) throw new NotFoundError();

    const { displayName, description } = req.body;
    await role.update({ displayName, description });

    const permissions = await Permission.scope('list').findAll();

    await role.$set(
      'permissions',
      role.name === aclConfig.roles.superuser ? permissions : req.body.permissions
    );

    await role.reload({ include: [{ model: Permission }] });
    const data = roleEntryResponse(role);

    res.json({ data, refs: { permissions } });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { roleId } = req.params;

    const role = await Role.findByPk(roleId);
    if (!role) throw new NotFoundError();

    await role.destroy();
    res.status(204).json();
  };

  return {
    browse,
    create,
    store,
    read,
    edit,
    update,
    destroy,
  };
};
