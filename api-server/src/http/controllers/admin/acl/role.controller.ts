import { Request, Response } from 'express';
import { Permission, Role } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import { roleEntryResponse } from '@/http/responses/admin';
import type { IoC } from '@/ioc';
import {
  CreateRoleResponse,
  RoleResponse,
  RolesResponse,
  StoreRoleResponse,
} from '@common/types/http/admin';
import type { Controller, CrudActions } from '@/http/controllers';

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

  const browse = async (req: Request, res: Response<RolesResponse>): Promise<void> => {
    const roles = await Role.paginate({
      req,
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
    let role = await Role.create({ name, displayName, description });
    await role.$set('permissions', permissions);

    role = (await Role.scope('permissions').findByPk(role.id)) as Role;
    const data = roleEntryResponse(role);

    res.status(201).json({ data });
  };

  const read = async (req: Request, res: Response<RoleResponse>): Promise<void> => entry(req, res);

  const edit = async (req: Request, res: Response<RoleResponse>): Promise<void> => entry(req, res);

  const update = async (req: Request, res: Response<RoleResponse>): Promise<void> => {
    const { roleId } = req.params;
    let role = await Role.scope('permissions').findByPk(roleId);

    if (!role) throw new NotFoundError();

    const { displayName, description } = req.body;
    await role.update({ displayName, description });

    const permissions = await Permission.scope('list').findAll();

    await role.$set(
      'permissions',
      role.name === aclConfig.roles.superuser ? permissions : req.body.permissions
    );

    role = (await Role.scope('permissions').findByPk(roleId)) as Role;
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
