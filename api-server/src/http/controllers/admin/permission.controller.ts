import { Request, Response, NextFunction } from 'express';
import acl from '@/config/acl';
import Permission from '@/db/models/system/permission';
import Role from '@/db/models/system/role';
import NotFoundError from '@/http/errors/not-found.error';

const entry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { permissionId } = req.params;
  const permission = await Permission.findByPk(permissionId);

  if (!permission) {
    next(new NotFoundError());
    return;
  }

  res.json({ data: permission, refs: {} });
};

export default {
  async list(req: Request, res: Response): Promise<void> {
    const permissions = await Permission.paginate({ req, columns: ['name', 'displayName'] });

    res.json(permissions);
  },

  async create(req: Request, res: Response): Promise<void> {
    res.json({ data: { id: null }, refs: {} });
  },

  async store(req: Request, res: Response): Promise<void> {
    const { name, displayName, description } = req.body;
    const permission = await Permission.create({ name, displayName, description });

    // Always attach new permission to main admin role
    const superuser = await Role.findOne({ where: { name: acl.roles.superuser } });
    if (superuser) permission.$add('role', superuser);

    res.status(201).json({ data: permission });
  },

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
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
