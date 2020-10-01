import { Request, Response, NextFunction } from 'express';
import { Permission } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import {
  CreatePermissionResponse,
  PermissionResponse,
  PermissionsResponse,
  StorePermissionResponse,
} from '@common/types/http/admin/permissions';

const entry = async (
  req: Request,
  res: Response<PermissionResponse>,
  next: NextFunction
): Promise<void> => {
  const { permissionId } = req.params;
  const permission = await Permission.findByPk(permissionId);

  if (!permission) {
    next(new NotFoundError());
    return;
  }

  res.json({ data: permission, refs: {} });
};

export default {
  async list(req: Request, res: Response<PermissionsResponse>): Promise<void> {
    const permissions = await Permission.paginate({ req, columns: ['name', 'displayName'] });

    res.json(permissions);
  },

  async create(req: Request, res: Response<CreatePermissionResponse>): Promise<void> {
    res.json({ refs: {} });
  },

  async store(req: Request, res: Response<StorePermissionResponse>): Promise<void> {
    const { name, displayName, description } = req.body;
    const permission = await Permission.create({ name, displayName, description });

    res.status(201).json({ data: permission });
  },

  async detail(req: Request, res: Response<PermissionResponse>, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async edit(req: Request, res: Response<PermissionResponse>, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async update(req: Request, res: Response<PermissionResponse>, next: NextFunction): Promise<void> {
    const { permissionId } = req.params;
    const permission = await Permission.findByPk(permissionId);

    if (!permission) {
      next(new NotFoundError());
      return;
    }

    const { displayName, description } = req.body;
    await permission.update({ displayName, description });

    res.json({ data: permission, refs: {} });
  },

  async delete(req: Request, res: Response<undefined>, next: NextFunction): Promise<void> {
    const { permissionId } = req.params;
    const permission = await Permission.findByPk(permissionId);

    if (!permission) {
      next(new NotFoundError());
      return;
    }

    await permission.destroy();
    res.status(204).json();
  },
};
