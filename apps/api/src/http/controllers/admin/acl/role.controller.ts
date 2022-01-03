import { Request, Response } from 'express';
import { RoleEntry, RoleRefs, RolesResponse } from '@common/types/http/admin';
import { Permission, Role, PaginateQuery } from '@api/db';
import { NotFoundError } from '@api/http/errors';
import { roleEntryResponse } from '@api/http/responses/admin';
import type { IoC } from '@api/ioc';
import type { Controller, CrudActions } from '@api/http/controllers';
import { pick } from 'lodash';

export type RoleController = Controller<CrudActions>;

export default ({ aclConfig }: Pick<IoC, 'aclConfig'>): RoleController => {
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

    await role.reload({ include: [{ model: Permission }] });

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

    await role.reload({ include: [{ model: Permission }] });

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
