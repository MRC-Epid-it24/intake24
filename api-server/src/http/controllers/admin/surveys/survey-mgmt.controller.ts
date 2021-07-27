import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {
  SurveyMgmtAvailableResponse,
  SurveyMgmtResponse,
  UserMgmtListEntry,
} from '@common/types/http/admin';
import { Permission, Survey, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import { permissionListResponse, userMgmtResponse } from '@/http/responses/admin';
import type { IoC } from '@/ioc';
import { surveyMgmt } from '@/services/auth';
import { Controller } from '../../controller';

export type AdminSurveyMgmtController = Controller<'browse' | 'available' | 'update'>;

export default ({ surveyService }: Pick<IoC, 'surveyService'>): AdminSurveyMgmtController => {
  const browse = async (req: Request, res: Response<SurveyMgmtResponse>): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    const users = await User.paginate<UserMgmtListEntry>({
      req,
      columns: ['name', 'email', 'simpleName'],
      attributes: ['id', 'name', 'email'],
      order: [['name', 'ASC']],
      include: [
        {
          model: Permission,
          attributes: ['id', 'name', 'displayName'],
          where: { name: surveyMgmt(surveyId) },
        },
      ],
      transform: userMgmtResponse,
    });

    res.json(users);
  };

  const available = async (
    req: Request,
    res: Response<SurveyMgmtAvailableResponse>
  ): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
      where: {
        email: { [Op.ne]: null },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        '$permissions.id$': { [Op.eq]: null },
      },
      order: [['email', 'ASC']],
      include: [
        {
          model: Permission,
          attributes: ['id', 'name', 'displayName'],
          required: false,
          where: { name: { [Op.in]: surveyMgmt(surveyId) } },
        },
      ],
    });

    const permissions = await surveyService.getSurveyMgmtPermissions(surveyId, 'list');

    res.json({
      users: users.map(userMgmtResponse),
      permissions: permissions.map(permissionListResponse),
    });
  };

  const update = async (req: Request, res: Response<undefined>): Promise<void> => {
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
    browse,
    available,
    update,
  };
};
