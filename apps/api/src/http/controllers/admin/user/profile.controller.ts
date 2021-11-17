import { Request, Response } from 'express';
import { User } from '@api/db/models/system';
import type { Controller } from '@api/http/controllers';

export type UserProfileController = Controller<'index'>;

export default (): UserProfileController => {
  const index = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as User;
    const { aclService } = req.scope.cradle;

    const { name, email, phone } = user;
    const [permissions, roles] = (
      await Promise.all([aclService.getPermissions(), aclService.getRoles()])
    ).map((aclItem) => aclItem.map((item) => item.name));

    res.json({ profile: { name, email, phone }, permissions, roles });
  };

  return {
    index,
  };
};
