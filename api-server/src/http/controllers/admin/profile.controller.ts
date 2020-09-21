import { Request, Response } from 'express';
import { User } from '@/db/models/system';

export default {
  async index(req: Request, res: Response): Promise<void> {
    const user = req.user as User;

    const { name, email, phone } = user;
    const permissions = user.allPermissions().map((item) => item.name);
    const roles = user.allRoles().map((item) => item.name);

    res.json({ profile: { name, email, phone }, permissions, roles });
  },
};
