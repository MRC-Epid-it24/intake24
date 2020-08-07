import { Request, Response } from 'express';
import { User } from '@/db/models/system';

export default {
  async index(req: Request, res: Response): Promise<void> {
    const { name, email, phone } = req.user as User;
    const permissions = (req.user as User).allPermissions().map((item) => item.name);
    const roles = (req.user as User).allRoles().map((item) => item.name);

    res.json({ profile: { name, email, phone }, permissions, roles });
  },
};
