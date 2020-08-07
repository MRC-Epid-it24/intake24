import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { UserResponse } from '@common/types/api/admin/users';
import Permission from '@/db/models/system/permission';
import Survey from '@/db/models/system/survey';
import User from '@/db/models/system/user';
import NotFoundError from '@/http/errors/not-found.error';
import userResponse from '@/http/responses/admin/user.response';
import { surveyMgmt } from '@/services/acl.service';
import surveySvc from '@/services/survey.service';

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
      include: [{ model: Permission, where: { name: surveyMgmt(surveyId) } }],
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
      where: {
        email: { [Op.ne]: null },
        '$permissions.name$': { [Op.or]: { [Op.eq]: null, [Op.notIn]: surveyMgmt(surveyId) } },
      },
      include: [{ model: Permission, through: { attributes: [] }, required: false }],
    });

    const permissions = await surveySvc.getSurveyMgmtPermissions(surveyId, 'list');

    res.json({ data: users.map(userResponse), permissions });
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const {
      params: { surveyId, userId },
      body: { permissions },
    } = req;

    const survey = await Survey.findByPk(surveyId);
    const user = await User.findOne({ where: { id: userId, email: { [Op.ne]: null } } });

    if (!survey || !user) {
      next(new NotFoundError());
      return;
    }

    const surveyMgmtPermissions = await surveySvc.getSurveyMgmtPermissions(surveyId, 'list');

    await user.$remove('permissions', surveyMgmtPermissions);

    if (Array.isArray(permissions) && !!permissions.length)
      await user.$add('permissions', permissions);

    res.json();
  },
};
