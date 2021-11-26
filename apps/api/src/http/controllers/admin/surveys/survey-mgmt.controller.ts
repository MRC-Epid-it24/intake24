import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {
  SurveyMgmtAvailableResponse,
  SurveyMgmtResponse,
  UserMgmtListEntry,
} from '@common/types/http/admin';
import { Permission, Survey, User } from '@api/db/models/system';
import { NotFoundError } from '@api/http/errors';
import { permissionListResponse, userMgmtResponse } from '@api/http/responses/admin';
import type { IoC } from '@api/ioc';
import { surveyMgmt } from '@api/services/auth';
import { Controller } from '../../controller';

export type AdminSurveyMgmtController = Controller<'browse' | 'available' | 'update'>;

export default ({
  adminSurveyService,
}: Pick<IoC, 'adminSurveyService'>): AdminSurveyMgmtController => {
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
        // @ts-expect-error: Sequelize typings don't know about this type of syntax yet
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

    const permissions = await adminSurveyService.getSurveyMgmtPermissions(surveyId, 'list');

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

    const [survey, user] = await Promise.all([
      Survey.findByPk(surveyId),
      User.findOne({ where: { id: userId, email: { [Op.ne]: null } } }),
    ]);

    if (!survey || !user) throw new NotFoundError();

    const surveyMgmtPermissions = await adminSurveyService.getSurveyMgmtPermissions(
      surveyId,
      'list'
    );

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
