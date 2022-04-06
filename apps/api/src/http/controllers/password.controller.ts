import type { Request, Response } from 'express';
import { randomString } from '@intake24/common/util';
import { Op, User, UserPasswordReset } from '@intake24/db';
import { ValidationError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type { Controller } from './controller';

export type PasswordController = Controller<'request' | 'reset'>;

export default ({
  adminUserService,
  logger,
  scheduler,
  securityConfig,
}: Pick<
  IoC,
  'adminUserService' | 'logger' | 'securityConfig' | 'scheduler'
>): PasswordController => {
  const request = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { email } = req.body;

    const op = User.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;
    const user = await User.findOne({ where: { email: { [op]: email } } });

    // Silently fail not to inform potential scanners of email existence in database
    if (!user) {
      logger.warn(`Password reset: email address (${email}) not found in database.`);
      res.json();
      return;
    }

    const { id: userId } = user;
    const token = randomString(64);

    await Promise.all([
      UserPasswordReset.create({ userId, token }),
      scheduler.jobs.addJob({ type: 'SendPasswordReset', userId }, { email, token }),
    ]);

    res.json();
  };

  const reset = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { email, password, token } = req.body;

    const expiredAt = new Date(Date.now() - securityConfig.passwords.expiresIn);
    const op = User.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;

    const passwordReset = await UserPasswordReset.findOne({
      where: { token, createdAt: { [Op.gt]: expiredAt } },
      include: [{ model: User, where: { email: { [op]: email } } }],
    });

    if (!passwordReset)
      throw new ValidationError(
        `It looks like this link is invalid / expired. Please check your email or request another link.`,
        { param: 'token' }
      );

    const { userId } = passwordReset;

    await Promise.all([adminUserService.updatePassword(userId, password), passwordReset.destroy()]);

    res.json();
  };

  return { request, reset };
};
