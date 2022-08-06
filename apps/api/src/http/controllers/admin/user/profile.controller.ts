import type { Request, Response } from 'express';

import type { AdminUserProfileResponse } from '@intake24/common/types/http/admin';
import type { User } from '@intake24/db';

const adminUserProfileController = () => {
  const index = async (req: Request, res: Response<AdminUserProfileResponse>): Promise<void> => {
    const user = req.user as User;
    const { aclService } = req.scope.cradle;

    const { id, name, email, phone } = user;
    const [permissions, roles] = (
      await Promise.all([aclService.getPermissions(), aclService.getRoles()])
    ).map((aclItem) => aclItem.map((item) => item.name));

    res.json({ profile: { id, name, email, phone }, permissions, roles });
  };

  return {
    index,
  };
};

export default adminUserProfileController;

export type AdminUserProfileController = ReturnType<typeof adminUserProfileController>;
