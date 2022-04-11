import type { Request, Response } from 'express';
import { pick } from 'lodash';
import { randomString } from '@intake24/common/util';
import { Op, WhereOptions, Permission, Survey, User, PaginateQuery } from '@intake24/db';
import type {
  SurveyMgmtAvailablePermissionsResponse,
  SurveyMgmtAvailableUsersResponse,
  SurveyMgmtResponse,
  UserMgmtListEntry,
} from '@intake24/common/types/http/admin';
import { NotFoundError } from '@intake24/api/http/errors';
import { permissionListResponse, userMgmtResponse } from '@intake24/api/http/responses/admin';
import type { IoC } from '@intake24/api/ioc';
import { surveyMgmt } from '@intake24/common/security';
import type { UserAttributes } from '@intake24/common/types/models';
import type { Controller } from '../../controller';

export type AdminSurveyMgmtController = Controller<
  'browse' | 'availablePermissions' | 'availableUsers' | 'store' | 'update'
>;

export default ({
  adminSurveyService,
  adminUserService,
}: Pick<IoC, 'adminSurveyService' | 'adminUserService'>): AdminSurveyMgmtController => {
  const browse = async (
    req: Request<{ surveyId: string }, any, any, PaginateQuery>,
    res: Response<SurveyMgmtResponse>
  ): Promise<void> => {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const users = await User.paginate<UserMgmtListEntry>({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name', 'email', 'simpleName'],
      attributes: ['id', 'name', 'email'],
      order: [['name', 'ASC']],
      include: [
        {
          model: Permission,
          attributes: ['id', 'name', 'displayName'],
          through: { attributes: [] },
          where: { name: { [Op.or]: [surveyMgmt(surveyId), { [Op.startsWith]: 'surveys-' }] } },
        },
      ],
      transform: userMgmtResponse,
    });

    res.json(users);
  };

  const store = async (
    req: Request<{ surveyId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const {
      params: { surveyId },
      body: { email, name, phone, permissions },
    } = req;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    await adminUserService.create({ email, name, phone, password: randomString(12), permissions });

    res.status(201).json();
  };

  const update = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const {
      params: { surveyId, userId },
      body: { permissions },
    } = req;

    const [survey, user] = await Promise.all([
      Survey.findByPk(surveyId),
      User.findOne({ where: { id: userId, email: { [Op.ne]: null } } }),
    ]);
    if (!survey || !user) throw new NotFoundError();

    const surveyPermissions = await adminSurveyService.getSurveyPermissions(surveyId, 'list');

    await user.$remove('permissions', surveyPermissions);

    if (Array.isArray(permissions) && !!permissions.length)
      await user.$add('permissions', permissions);

    await adminUserService.flushACLCache(user.id);

    res.json();
  };

  const availablePermissions = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyMgmtAvailablePermissionsResponse>
  ): Promise<void> => {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const permissions = await adminSurveyService.getSurveyPermissions(surveyId, 'list');

    res.json(permissions.map(permissionListResponse));
  };

  const availableUsers = async (
    req: Request<{ surveyId: string }, any, any, PaginateQuery>,
    res: Response<SurveyMgmtAvailableUsersResponse>
  ): Promise<void> => {
    const {
      params: { surveyId },
      query: { search },
    } = req;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    if (!search) {
      res.json([]);
      return;
    }

    const where: WhereOptions<UserAttributes> = {
      email: { [Op.ne]: null },
      '$permissions.id$': { [Op.eq]: null },
    };

    const op =
      User.sequelize?.getDialect() === 'postgres'
        ? { [Op.iLike]: `%${search}%` }
        : { [Op.substring]: search };

    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
      where: { ...where, [Op.or]: { name: op, email: op } },
      order: [['email', 'ASC']],
      limit: 10,
      subQuery: false,
      include: [
        {
          model: Permission,
          attributes: [],
          through: { attributes: [] },
          required: false,
          where: { name: { [Op.or]: [surveyMgmt(surveyId), { [Op.startsWith]: 'surveys-' }] } },
        },
      ],
    });

    res.json(users.map(userMgmtResponse));
  };

  return {
    browse,
    store,
    update,
    availablePermissions,
    availableUsers,
  };
};
