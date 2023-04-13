import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  AvailableUsersWithSecurablesResponse,
  CreateUserWithSecurables,
  UpdateSecurableOwnerRequest,
  UsersWithSecurablesResponse,
} from '@intake24/common/types/http/admin';
import type {
  ModelStatic,
  PaginateQuery,
  Securable,
  UserSecurableAttributes,
  UserSecurableCreationAttributes,
} from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { userSecurablesResponse } from '@intake24/api/http/responses/admin';
import { isSecurableType } from '@intake24/common/security';
import {
  getRequestParamFromSecurable,
  getResourceFromSecurable,
  randomString,
} from '@intake24/common/util';
import { Op, User, UserSecurable } from '@intake24/db';

export const getAndCheckAccess = async <T extends Securable>(
  securable: ModelStatic<T>,
  action: string,
  req: Request,
  scope?: string | string[]
): Promise<T> => {
  const { aclService } = req.scope.cradle;
  const { params } = req;

  return aclService.getAndCheckRecordAccess(securable, action, { params, scope });
};

export const securableController = ({
  securable,
  ioc: { adminUserService },
}: {
  ioc: IoC;
  securable: ModelStatic<Securable>;
}) => {
  const securableType = securable.name;
  if (!isSecurableType(securableType)) throw Error('Invalid securable type');

  const resource = getResourceFromSecurable(securableType);
  const paramId = getRequestParamFromSecurable(securableType);

  const addSecurableAccess = async (
    user: User,
    resource: string,
    records: UserSecurableCreationAttributes[],
    removeSecurable?: Pick<UserSecurableAttributes, 'userId' | 'securableType' | 'securableId'>
  ) => {
    if (removeSecurable) await UserSecurable.destroy({ where: removeSecurable });

    await Promise.all([
      UserSecurable.bulkCreate(records),
      adminUserService.addPermissionByName(user, resource),
    ]);
  };

  const removeSecurableAccess = async (
    user: User,
    resource: string,
    securable: Pick<UserSecurableAttributes, 'userId' | 'securableType' | 'securableId'>
  ) => {
    const { userId, securableType, securableId } = securable;
    const otherSecurables = await UserSecurable.findAll({
      where: { userId, securableType, securableId: { [Op.ne]: securableId } },
    });

    await Promise.all(
      [
        UserSecurable.destroy({ where: securable }),
        otherSecurables.length ? null : adminUserService.removePermissionByName(user, resource),
      ].filter(Boolean)
    );
  };

  const browse = async (
    req: Request<Record<string, string>, any, any, PaginateQuery>,
    res: Response<UsersWithSecurablesResponse>
  ): Promise<void> => {
    await getAndCheckAccess(securable, 'securables', req as Request);

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
    await getAndCheckAccess(securable, 'securables', req);

    const {
      params: { [paramId]: securableId },
      body: { email, name, phone, actions },
    } = req;

    const user = await adminUserService.create(
      { email, name, phone, password: randomString(12) },
      { notify: true }
    );

    if (actions.length) {
      const records = actions.map((action) => ({
        userId: user.id,
        securableId,
        securableType,
        action,
      }));

      await addSecurableAccess(user, resource, records);
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
      getAndCheckAccess(securable, 'securables', req),
      User.findOne({
        where: { id: userId, email: { [Op.ne]: null } },
        include: [
          { association: 'securables', required: false, where: { securableType, securableId } },
        ],
      }),
    ]);
    if (!user) throw new NotFoundError();

    const securableInput = { userId, securableId, securableType };

    if (actions.length) {
      const currentActions = user.securables?.map((sec) => sec.action).sort() ?? [];
      const actionsMatch =
        actions.length === currentActions.length &&
        actions.sort().every((action, idx) => action === currentActions[idx]);

      if (!actionsMatch) {
        const records = actions.map((action) => ({ ...securableInput, action }));
        await addSecurableAccess(user, resource, records, securableInput);
      }
    } else {
      await removeSecurableAccess(user, resource, securableInput);
    }

    res.json();
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const {
      params: { [paramId]: securableId, userId },
    } = req;

    const [, user] = await Promise.all([
      getAndCheckAccess(securable, 'securables', req),
      User.findOne({ where: { id: userId, email: { [Op.ne]: null } } }),
    ]);
    if (!user) throw new NotFoundError();

    await removeSecurableAccess(user, resource, { userId, securableId, securableType });

    res.json();
  };

  const availableUsers = async (
    req: Request<Record<string, string>, any, any, PaginateQuery>,
    res: Response<AvailableUsersWithSecurablesResponse>
  ): Promise<void> => {
    await getAndCheckAccess(securable, 'securables', req as Request);

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
    const securableRecord = await getAndCheckAccess(securable, 'securables', req);

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

export type SecurableController = ReturnType<typeof securableController>;
