import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { AdminUserProfileResponse } from '@intake24/common/types/http/admin';
import type { User } from '@intake24/db';

const adminUserProfileController = ({ scheduler }: Pick<IoC, 'scheduler'>) => {
  const index = async (req: Request, res: Response<AdminUserProfileResponse>): Promise<void> => {
    const user = req.user as User;
    const { aclService } = req.scope.cradle;

    const { id, name, email, phone, verifiedAt } = user;
    const [permissions, roles] = (
      await Promise.all([aclService.getPermissions(), aclService.getRoles()])
    ).map((aclItem) => aclItem.map((item) => item.name));

    res.json({ profile: { id, name, email, phone, verifiedAt }, permissions, roles });
  };

  const verify = async (req: Request, res: Response<undefined>): Promise<void> => {
    const user = req.user as User;
    const { email } = user;

    if (!email || user.isVerified()) {
      res.json();
      return;
    }

    const {
      headers: { 'user-agent': userAgent },
    } = req;

    await scheduler.jobs.addJob({
      type: 'UserEmailVerificationNotification',
      params: { email, userAgent },
    });

    res.json();
  };

  return {
    index,
    verify,
  };
};

export default adminUserProfileController;

export type AdminUserProfileController = ReturnType<typeof adminUserProfileController>;
