import { Request, Response } from 'express';
import { User } from '@/db/models/system';
import { Controller } from '../controller';

export type ProfileController = Controller<'index'>;

export default (): ProfileController => {
  const index = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as User;

    const { name, email, phone } = user;
    const permissions = user.allPermissions().map((item) => item.name);
    const roles = user.allRoles().map((item) => item.name);

    res.json({ profile: { name, email, phone }, permissions, roles });
  };

  return {
    index,
  };
};
