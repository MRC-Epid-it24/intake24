import { Request, Response } from 'express';
import { pick } from 'lodash';
import {
  CreatePermissionResponse,
  PermissionResponse,
  PermissionsResponse,
  StorePermissionResponse,
} from '@common/types/http/admin';
import { Permission } from '@api/db/models/system';
import { NotFoundError } from '@api/http/errors';
import type { Controller, CrudActions } from '@api/http/controllers';
import { PaginateQuery } from '@api/db/models/model';

export type PermissionController = Controller<CrudActions>;

export default (): PermissionController => {
  const entry = async (req: Request, res: Response<PermissionResponse>): Promise<void> => {
    const { permissionId } = req.params;

    const permission = await Permission.findByPk(permissionId);
    if (!permission) throw new NotFoundError();

    res.json({ data: permission, refs: {} });
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

  const create = async (req: Request, res: Response<CreatePermissionResponse>): Promise<void> => {
    res.json({ refs: {} });
  };

  const store = async (req: Request, res: Response<StorePermissionResponse>): Promise<void> => {
    const { name, displayName, description } = req.body;
    const permission = await Permission.create({ name, displayName, description });

    res.status(201).json({ data: permission });
  };

  const read = async (req: Request, res: Response<PermissionResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<PermissionResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<PermissionResponse>): Promise<void> => {
    const { permissionId } = req.params;

    const permission = await Permission.findByPk(permissionId);
    if (!permission) throw new NotFoundError();

    const { displayName, description } = req.body;
    await permission.update({ displayName, description });

    res.json({ data: permission, refs: {} });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { permissionId } = req.params;

    const permission = await Permission.findByPk(permissionId);
    if (!permission) throw new NotFoundError();

    await permission.destroy();
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
