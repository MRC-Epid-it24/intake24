import { Request, Response } from 'express';
import acl from '@/config/acl';
import { Permission, Role } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import {
  CreateRoleResponse,
  RoleResponse,
  RolesResponse,
  StoreRoleResponse,
} from '@common/types/http/admin/roles';

const entry = async (req: Request, res: Response<RoleResponse>): Promise<void> => {
  const { roleId } = req.params;
  const role = await Role.scope('permissions').findByPk(roleId);

  if (!role) throw new NotFoundError();

  const permissions = await Permission.scope('list').findAll();

  res.json({ data: role, refs: { permissions } });
};

export default {
  async list(req: Request, res: Response<RolesResponse>): Promise<void> {
    const roles = await Role.paginate({ req, columns: ['name', 'displayName'] });

    res.json(roles);
  },

  async create(req: Request, res: Response<CreateRoleResponse>): Promise<void> {
    const permissions = await Permission.scope('list').findAll();

    res.json({ refs: { permissions } });
  },

  async store(req: Request, res: Response<StoreRoleResponse>): Promise<void> {
    const { name, displayName, description, permissions } = req.body;
    const role = await Role.create({ name, displayName, description });
    await role.$set('permissions', permissions);

    res.status(201).json({ data: role });
  },

  async detail(req: Request, res: Response<RoleResponse>): Promise<void> {
    entry(req, res);
  },

  async edit(req: Request, res: Response<RoleResponse>): Promise<void> {
    entry(req, res);
  },

  async update(req: Request, res: Response<RoleResponse>): Promise<void> {
    const { roleId } = req.params;
    let role = await Role.scope('permissions').findByPk(roleId);

    if (!role) throw new NotFoundError();

    const { displayName, description } = req.body;
    await role.update({ displayName, description });

    const permissions = await Permission.scope('list').findAll();

    await role.$set(
      'permissions',
      role.name === acl.roles.superuser ? permissions : req.body.permissions
    );

    role = (await Role.scope('permissions').findByPk(roleId)) as Role;

    res.json({ data: role, refs: { permissions } });
  },

  async delete(req: Request, res: Response<undefined>): Promise<void> {
    const { roleId } = req.params;
    const role = await Role.findByPk(roleId);

    if (!role) throw new NotFoundError();

    await role.destroy();
    res.status(204).json();
  },
};
