import type { Request, Response } from 'express';
import { pick } from 'lodash';
import { plural } from 'pluralize';
import {
  ModelStatic,
  Op,
  PaginateQuery,
  securableScope,
  Securable,
  User,
  UserSecurable,
} from '@intake24/db';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { kebabCase } from '@intake24/common/util';
import { isSecurableType } from '@intake24/common/acl';
import type { Controller } from '../controller';

export type SecurableController = Controller<'browse' | 'update' | 'destroy' | 'availableUsers'>;

export default (securable: ModelStatic<Securable>): SecurableController => {
  const securableType = securable.name;
  if (!isSecurableType(securableType)) throw Error('Invalid securable type');

  const resource = kebabCase(plural(securableType));
  const paramId = `${securableType[0].toLowerCase()}${securableType.substring(1)}Id`;

  const getAndCheckAccess = async (req: Request, action: string): Promise<Securable> => {
    const { [paramId]: securableId } = req.params;
    const { aclService, userId } = req.scope.cradle;

    const record = await securable.findByPk(securableId, securableScope(userId));
    if (!record) throw new NotFoundError();

    if (
      (await aclService.hasPermission(`${resource}|${action}`)) ||
      (await aclService.canAccessRecord(record, action))
    )
      return record;

    throw new ForbiddenError();
  };

  const browse = async (
    req: Request<Record<string, string>, any, any, PaginateQuery>,
    res: Response
  ): Promise<void> => {
    await getAndCheckAccess(req as Request, 'securables');

    const { [paramId]: securableId } = req.params;

    const users = await User.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name', 'email', 'simpleName'],
      attributes: ['id', 'email', 'name'],
      order: [['email', 'ASC']],
      include: [{ association: 'securables', where: { securableType, securableId } }],
    });

    res.json(users);
  };

  const update = async (
    req: Request<Record<string, string>, any, { actions: string[] }>,
    res: Response<undefined>
  ): Promise<void> => {
    const {
      params: { [paramId]: securableId, userId },
      body: { actions },
    } = req;

    const [, user] = await Promise.all([
      getAndCheckAccess(req, 'securables'),
      User.findOne({ where: { id: userId, email: { [Op.ne]: null } } }),
    ]);
    if (!user) throw new NotFoundError();

    const records = actions.map((action) => ({ userId, securableId, securableType, action }));

    await UserSecurable.destroy({ where: { userId, securableId, securableType } });
    await UserSecurable.bulkCreate(records);

    res.json();
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const {
      params: { [paramId]: securableId, userId },
    } = req;

    const [, user] = await Promise.all([
      getAndCheckAccess(req, 'securables'),
      User.findOne({ where: { id: userId, email: { [Op.ne]: null } } }),
    ]);
    if (!user) throw new NotFoundError();

    await UserSecurable.destroy({ where: { userId, securableId, securableType } });

    res.json();
  };

  const availableUsers = async (
    req: Request<Record<string, string>, any, any, PaginateQuery>,
    res: Response
  ): Promise<void> => {
    await getAndCheckAccess(req as Request, 'securables');

    const {
      params: { [paramId]: securableId },
      query: { search },
    } = req;

    if (!search) {
      res.json([]);
      return;
    }

    const op =
      User.sequelize?.getDialect() === 'postgres'
        ? { [Op.iLike]: `%${search}%` }
        : { [Op.substring]: search };

    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
      where: {
        email: { [Op.ne]: null },
        '$securables.user_id$': { [Op.eq]: null },
        [Op.or]: { name: op, email: op },
      },
      order: [['email', 'ASC']],
      limit: 10,
      subQuery: false,
      include: [
        {
          association: 'securables',
          attributes: [],
          required: false,
          where: { securableType, securableId },
        },
      ],
    });

    res.json(users);
  };

  return {
    browse,
    update,
    destroy,
    availableUsers,
  };
};
