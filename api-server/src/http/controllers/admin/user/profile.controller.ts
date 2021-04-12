import { Request, Response } from 'express';
import { User } from '@/db/models/system';
import type { Controller } from '@/http/controllers';

export type UserProfileController = Controller<'index'>;

export default (): UserProfileController => {
  const index = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as User;
    const { aclService } = req.scope.cradle;

    const { name, email, phone } = user;
    const permissions = (await aclService.getPermissions()).map((item) => item.name);
    const roles = (await aclService.getRoles()).map((item) => item.name);

    res.json({ profile: { name, email, phone }, permissions, roles });
  };

  return {
    index,
  };
};
