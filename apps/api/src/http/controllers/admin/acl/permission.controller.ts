import type { Request, Response } from 'express';
import { pick } from 'lodash';
import type { PermissionEntry, PermissionsResponse } from '@intake24/common/types/http/admin';
import { Permission, PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import type { Controller, CrudActions } from '@intake24/api/http/controllers';

export type PermissionController = Controller<CrudActions>;

export default (): PermissionController => {
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
      order: [['name', 'ASC']],
    });

    res.json(permissions);
  };

  const store = async (req: Request, res: Response<PermissionEntry>): Promise<void> => {
    const { name, displayName, description } = req.body;
    const permission = await Permission.create({ name, displayName, description });

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
