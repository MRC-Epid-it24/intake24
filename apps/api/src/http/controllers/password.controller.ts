import type { Request, Response } from 'express';
import ms from 'ms';

import type { IoC } from '@intake24/api/ioc';
import { ValidationError } from '@intake24/api/http/errors';
import { Op, User, UserPasswordReset } from '@intake24/db';

const passwordController = ({
  adminUserService,
  scheduler,
  securityConfig,
}: Pick<IoC, 'adminUserService' | 'securityConfig' | 'scheduler'>) => {
  const request = async (req: Request, res: Response<undefined>): Promise<void> => {
    const {
      body: { email },
      headers: { 'user-agent': userAgent },
    } = req;

    await scheduler.jobs.addJob({
      type: 'UserPasswordResetNotification',
      params: { email, userAgent },
    });

    res.json();
  };

  const reset = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { email, password, token } = req.body;

    const expiredAt = new Date(Date.now() - ms(securityConfig.passwords.expiresIn));
    const op = User.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;

    const passwordReset = await UserPasswordReset.findOne({
      attributes: ['id', 'userId'],
      where: { token, createdAt: { [Op.gt]: expiredAt } },
      include: [{ association: 'user', where: { email: { [op]: email } } }],
    });

    if (!passwordReset)
      throw new ValidationError(
        `It looks like this link is invalid / expired. Please check your email or request another link.`,
        { path: 'token' }
      );

    const { userId } = passwordReset;

    await Promise.all([adminUserService.updatePassword(userId, password), passwordReset.destroy()]);

    res.json();
  };

  return { request, reset };
};

export default passwordController;

export type PasswordController = ReturnType<typeof passwordController>;
