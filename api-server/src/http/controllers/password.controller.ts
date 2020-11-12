import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';
import config from '@/config';
import { User, UserPasswordReset } from '@/db/models/system';
import { ValidationError } from '@/http/errors';
import logger from '@/services/logger';
import scheduler from '@/services/scheduler';
import userSvc from '@/services/user.service';

export default {
  async request(req: Request, res: Response<undefined>): Promise<void> {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    // Silently fail not to inform potential scanners of email existence in database
    if (!user) {
      logger.warn(`Password reset: email address (${email}) not found in database.`);
      res.json();
      return;
    }

    const { id: userId } = user;
    const token = nanoid(64);
    await UserPasswordReset.create({ userId, token });

    await scheduler.jobs.addJob(
      { type: 'SendPasswordReset', userId },
      { email, token },
      { removeOnComplete: true }
    );

    res.json();
  },

  async reset(req: Request, res: Response<undefined>): Promise<void> {
    const { email, password, token } = req.body;

    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() - config.security.passwords.expire);

    const passwordReset = await UserPasswordReset.findOne({
      where: { token, createdAt: { [Op.gt]: expiredAt } },
      include: [{ model: User, where: { email } }],
    });

    if (!passwordReset)
      throw new ValidationError(
        'token',
        `It looks like this link is invalid / expired. Please check your email or request another link.`
      );

    await userSvc.updatePassword(passwordReset.userId, password);

    await passwordReset.destroy();

    res.json();
  },
};
