import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { RoleEntry, RoleRefs, RolesResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { roleEntryResponse } from '@intake24/api/http/responses/admin';
import { Permission, Role } from '@intake24/db';

const roleController = ({
  aclConfig,
  adminUserService,
}: Pick<IoC, 'aclConfig' | 'adminUserService'>) => {
  const entry = async (
    req: Request<{ roleId: string }>,
    res: Response<RoleEntry>
  ): Promise<void> => {
    const { roleId } = req.params;

    const role = await Role.scope('permissions').findByPk(roleId);
    if (!role) throw new NotFoundError();

    res.json(roleEntryResponse(role));
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

  const store = async (req: Request, res: Response<RoleEntry>): Promise<void> => {
    const { name, displayName, description, permissions } = req.body;
    const role = await Role.create({ name, displayName, description });
    await role.$set('permissions', permissions);

    await Promise.all([
      role.reload({ include: [{ model: Permission }] }),
      adminUserService.flushRoleACLCache(role.id),
    ]);

    res.status(201).json(roleEntryResponse(role));
  };

  const read = async (req: Request<{ roleId: string }>, res: Response<RoleEntry>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request<{ roleId: string }>, res: Response<RoleEntry>): Promise<void> =>
    entry(req, res);

  const update = async (
    req: Request<{ roleId: string }>,
    res: Response<RoleEntry>
  ): Promise<void> => {
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

    await Promise.all([
      role.reload({ include: [{ model: Permission }] }),
      adminUserService.flushRoleACLCache(role.id),
    ]);

    res.json(roleEntryResponse(role));
  };

  const destroy = async (
    req: Request<{ roleId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { roleId } = req.params;

    const role = await Role.findByPk(roleId);
    if (!role) throw new NotFoundError();

    await role.destroy();
    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<RoleRefs>): Promise<void> => {
    const permissions = await Permission.scope('list').findAll();

    res.json({ permissions });
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

export default roleController;

export type RoleController = ReturnType<typeof roleController>;
