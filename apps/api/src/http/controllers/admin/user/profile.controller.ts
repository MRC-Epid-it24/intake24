import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { AdminUserProfileResponse } from '@intake24/common/types/http/admin';
import { NotFoundError } from '@intake24/api/http/errors';
import { User } from '@intake24/db';

const adminUserProfileController = ({ scheduler }: Pick<IoC, 'scheduler'>) => {
  const index = async (req: Request, res: Response<AdminUserProfileResponse>): Promise<void> => {
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'phone', 'verifiedAt'],
    });
    if (!user) throw new NotFoundError();

    const { id, name, email, phone, verifiedAt } = user;
    const [permissions, roles] = await Promise.all([
      aclService.getPermissions(),
      aclService.getRoles(),
    ]);

    res.json({
      profile: { id, name, email: email as string, phone, verifiedAt },
      permissions,
      roles,
    });
  };

  const verify = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { userId } = req.scope.cradle.user;

    const user = await User.findByPk(userId, { attributes: ['id', 'email', 'verifiedAt'] });

    if (!user?.email || user.isVerified()) {
      res.json();
      return;
    }

    const {
      headers: { 'user-agent': userAgent },
    } = req;

    await scheduler.jobs.addJob({
      type: 'UserEmailVerificationNotification',
      params: { email: user.email, userAgent },
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
