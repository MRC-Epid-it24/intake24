import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { UserResponse } from '@common/types/http';
import { Permission, Survey, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import userResponse from '@/http/responses/admin/user.response';
import type { IoC } from '@/ioc';
import { surveyMgmt } from '@/services/acl.service';
import { Controller } from '../controller';

export type AdminSurveyMgmtController = Controller<'list' | 'available' | 'update'>;

export default ({ surveyService }: IoC): AdminSurveyMgmtController => {
  const list = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    const users = await User.paginate<UserResponse>({
      req,
      columns: ['name', 'email', 'simpleName'],
      include: [{ model: Permission, where: { name: surveyMgmt(surveyId) } }],
      transform: userResponse,
    });

    res.json(users);
  };

  const available = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    const users = await User.findAll({
      where: {
        email: { [Op.ne]: null },
        '$permissions.name$': { [Op.or]: { [Op.eq]: null, [Op.notIn]: surveyMgmt(surveyId) } },
      },
      include: [{ model: Permission, through: { attributes: [] }, required: false }],
    });

    const permissions = await surveyService.getSurveyMgmtPermissions(surveyId, 'list');

    res.json({ data: users.map(userResponse), permissions });
  };

  const update = async (req: Request, res: Response): Promise<void> => {
    const {
      params: { surveyId, userId },
      body: { permissions },
    } = req;

    const survey = await Survey.findByPk(surveyId);
    const user = await User.findOne({ where: { id: userId, email: { [Op.ne]: null } } });

    if (!survey || !user) throw new NotFoundError();

    const surveyMgmtPermissions = await surveyService.getSurveyMgmtPermissions(surveyId, 'list');

    await user.$remove('permissions', surveyMgmtPermissions);

    if (Array.isArray(permissions) && !!permissions.length)
      await user.$add('permissions', permissions);

    res.json();
  };

  return {
    list,
    available,
    update,
  };
};
