import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { UserResponse } from '@common/types/api/admin/users';
import Survey from '@/db/models/system/survey';
import User from '@/db/models/system/user';
import UserRole from '@/db/models/system/user-role';
import NotFoundError from '@/http/errors/not-found.error';
import userResponse from '@/http/responses/admin/user.response';
import { surveyMgmt } from '@/services/acl.service';

export default {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    const users = await User.paginate<UserResponse>({
      req,
      columns: ['name', 'email', 'simpleName'],
      include: [{ model: UserRole, where: { role: surveyMgmt(surveyId) } }],
      transform: userResponse,
    });

    res.json(users);
  },

  async available(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    const users = await User.findAll({
      where: { email: { [Op.ne]: null } },
      include: [{ model: UserRole, where: { role: { [Op.notIn]: surveyMgmt(surveyId) } } }],
    });

    res.json({ data: users.map(userResponse) });
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { surveyId, userId } = req.params;
    const survey = await Survey.findByPk(surveyId);
    const user = await User.findOne({ where: { email: { [Op.ne]: null } } });

    if (!survey || !user) {
      next(new NotFoundError());
      return;
    }

    await UserRole.destroy({ where: { userId, role: surveyMgmt(surveyId) } });

    const roles = (req.body.roles as string[]).map((role) => ({ userId, role }));
    if (roles.length) await UserRole.bulkCreate(roles);

    res.json();
  },
};
