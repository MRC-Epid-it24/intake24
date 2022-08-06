import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  AvailableUsersWithSecurablesResponse,
  CreateUserWithSecurables,
  UpdateSecurableOwnerRequest,
  UsersWithSecurablesResponse,
} from '@intake24/common/types/http/admin';
import type { ModelStatic, PaginateQuery, Securable } from '@intake24/db';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { userSecurablesResponse } from '@intake24/api/http/responses/admin';
import { isSecurableType } from '@intake24/common/security';
import { randomString, securableToResource } from '@intake24/common/util';
import { Op, securableScope, User, UserSecurable } from '@intake24/db';

const securableController = ({
  securable,
  ioc: { adminUserService },
}: {
  ioc: IoC;
  securable: ModelStatic<Securable>;
}) => {
  const securableType = securable.name;
  if (!isSecurableType(securableType)) throw Error('Invalid securable type');

  const resource = securableToResource(securableType);
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
    res: Response<UsersWithSecurablesResponse>
  ): Promise<void> => {
    await getAndCheckAccess(req as Request, 'securables');

    const { [paramId]: securableId } = req.params;

    const users = await User.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name', 'email', 'simpleName'],
      attributes: ['id', 'email', 'name'],
      order: [['email', 'ASC']],
      include: [{ association: 'securables', where: { securableType, securableId } }],
      transform: userSecurablesResponse,
    });

    res.json(users);
  };

  const store = async (
    req: Request<Record<string, string>, any, CreateUserWithSecurables>,
    res: Response<undefined>
  ): Promise<void> => {
    await getAndCheckAccess(req, 'securables');

    const {
      params: { [paramId]: securableId },
      body: { email, name, phone, actions },
    } = req;

    const user = await adminUserService.create({
      email,
      name,
      phone,
      password: randomString(12),
    });

    if (actions.length) {
      const records = actions.map((action) => ({
        userId: user.id,
        securableId,
        securableType,
        action,
      }));

      await Promise.all([
        UserSecurable.bulkCreate(records),
        adminUserService.addPermissionByName(user, resource),
      ]);
    }

    res.status(201).json();
  };

  const update = async (
    req: Request<Record<string, string>, any, Pick<CreateUserWithSecurables, 'actions'>>,
    res: Response<undefined>
  ): Promise<void> => {
    const {
      params: { [paramId]: securableId, userId },
      body: { actions },
    } = req;

    const [, user] = await Promise.all([
      getAndCheckAccess(req, 'securables'),
      User.findOne({
        where: { id: userId, email: { [Op.ne]: null } },
        include: [
          { association: 'securables', required: false, where: { securableType, securableId } },
        ],
      }),
    ]);
    if (!user) throw new NotFoundError();

    if (actions.length) {
      const currentActions = user.securables?.map((sec) => sec.action).sort() ?? [];
      const actionsMatch = actions.sort().every((action, idx) => action === currentActions[idx]);

      if (!actionsMatch) {
        const records = actions.map((action) => ({ userId, securableId, securableType, action }));

        await UserSecurable.destroy({ where: { userId, securableId, securableType } });
        await Promise.all([
          UserSecurable.bulkCreate(records),
          adminUserService.addPermissionByName(user, resource),
        ]);
      }
    } else {
      await Promise.all([
        UserSecurable.destroy({ where: { userId, securableId, securableType } }),
        adminUserService.removePermissionByName(user, resource),
      ]);
    }

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

    await Promise.all([
      UserSecurable.destroy({ where: { userId, securableId, securableType } }),
      adminUserService.removePermissionByName(user, resource),
    ]);

    res.json();
  };

  const availableUsers = async (
    req: Request<Record<string, string>, any, any, PaginateQuery>,
    res: Response<AvailableUsersWithSecurablesResponse>
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

  const owner = async (
    req: Request<Record<string, string>, any, UpdateSecurableOwnerRequest>,
    res: Response<undefined>
  ): Promise<void> => {
    const securableRecord = await getAndCheckAccess(req, 'securables');

    const {
      body: { userId },
    } = req;

    await securableRecord.update({ ownerId: userId });

    res.json();
  };

  return {
    browse,
    store,
    update,
    destroy,
    availableUsers,
    owner,
  };
};

export default securableController;

export type SecurableController = ReturnType<typeof securableController>;
