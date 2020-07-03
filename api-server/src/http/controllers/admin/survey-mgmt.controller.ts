import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Survey from '@/db/models/system/survey';
import User from '@/db/models/system/user';
import UserRole from '@/db/models/system/user-role';
import NotFoundError from '@/http/errors/not-found.error';
import { surveyStaff, surveySupport } from '@/services/acl.service';
import userResponse from '@/http/responses/admin/user.response';

export default {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    const staff = await User.paginate({
      req,
      columns: ['name', 'email', 'simpleName'],
      include: [
        { model: UserRole, where: { role: [surveyStaff(surveyId), surveySupport(surveyId)] } },
      ],
      transform: userResponse,
    });

    const users = await User.findAll({ where: { email: { [Op.ne]: null } } });

    res.json({ ...staff, refs: { users } });
  },

  async store(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    const { userId } = req.body;

    await UserRole.destroy({
      where: { userId, role: [surveyStaff(surveyId), surveySupport(surveyId)] },
    });

    const roles = req.body.roles as string[];
    if (roles.length) {
      const roleRecords = roles.map((role) => ({ userId, role }));
      await UserRole.bulkCreate(roleRecords);
    }

    res.status(201).json();
  },
};
