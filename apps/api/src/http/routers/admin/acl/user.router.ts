import type { AppRoute, AppRouter } from '@ts-rest/core';
import type { TsRestRequest } from '@ts-rest/express';
import type { WhereOptions } from 'sequelize';
import { initServer } from '@ts-rest/express';
import { col, fn, Op } from 'sequelize';

import { NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import { customTypeValidationMessage } from '@intake24/api/http/requests/util';
import { userEntryResponse } from '@intake24/api/http/responses/admin';
import { unique } from '@intake24/api/http/rules';
import { contract } from '@intake24/common/contracts';
import { Permission, Role, User } from '@intake24/db';

async function uniqueMiddleware<T extends AppRoute | AppRouter>(value: any, { userId, req }: { userId?: string; req: TsRestRequest<T> }) {
  const where: WhereOptions = userId ? { id: { [Op.ne]: userId } } : {};

  if (!(await unique({ model: User, condition: { field: 'email', value }, options: { where } }))) {
    throw new ValidationError(customTypeValidationMessage('unique._', { req, path: 'email' }), {
      path: 'email',
    });
  }
}

async function dataCheck<T extends AppRoute | AppRouter>({ permissions, roles, req }: { permissions?: string[]; roles?: string[]; req: TsRestRequest<T> }) {
  if (permissions) {
    const availablePermissions = await Permission.count({ where: { id: permissions } });
    if (availablePermissions !== permissions.length) {
      throw new ValidationError(customTypeValidationMessage('exists._', { req, path: 'permissions' }), {
        path: 'permissions',
      });
    }
  }

  if (roles) {
    const availableRoles = await Role.count({ where: { id: roles } });
    if (availableRoles !== roles.length) {
      throw new ValidationError(customTypeValidationMessage('exists._', { req, path: 'roles' }), {
        path: 'roles',
      });
    }
  }
}

export function user() {
  return initServer().router(contract.admin.acl.user, {
    browse: {
      middleware: [permission('acl', 'users', 'users|browse')],
      handler: async ({ query }) => {
        const users = await User.paginate({
          query,
          columns: ['name', 'email', 'simpleName'],
          include: [{ association: 'roles' }],
          order: [[fn('lower', col('User.name')), 'ASC']],
        });

        return { status: 200, body: users };
      },
    },
    store: {
      middleware: [permission('acl', 'users', 'users|create')],
      handler: async ({ body, req }) => {
        const { email, permissions, roles } = body;
        await uniqueMiddleware(email, { req });
        await dataCheck({ permissions, roles, req });

        const user = await req.scope.cradle.adminUserService.create(body);

        const data = userEntryResponse(
          (await User.scope(['aliases', 'customFields', 'permissions', 'roles']).findByPk(
            user.id,
          )) as User,
        );

        return { status: 201, body: data };
      },
    },
    refs: {
      middleware: [permission('acl', 'users')],
      handler: async () => {
        const [permissions, roles] = await Promise.all([
          Permission.scope('list').findAll({ order: [['name', 'ASC']] }),
          Role.scope('list').findAll({ order: [['name', 'ASC']] }),
        ]);

        return { status: 200, body: { permissions, roles } };
      },
    },
    read: {
      middleware: [permission('acl', 'users', 'users|read')],
      handler: async ({ params: { userId } }) => {
        const user = await User.scope(['aliases', 'customFields', 'permissions', 'roles']).findByPk(
          userId,
        );
        if (!user)
          throw new NotFoundError();

        return { status: 200, body: userEntryResponse(user) };
      },
    },
    edit: {
      middleware: [permission('acl', 'users', 'users|edit')],
      handler: async ({ params: { userId } }) => {
        const user = await User.scope(['aliases', 'customFields', 'permissions', 'roles']).findByPk(
          userId,
        );
        if (!user)
          throw new NotFoundError();

        return { status: 200, body: userEntryResponse(user) };
      },
    },
    update: {
      middleware: [permission('acl', 'users', 'users|edit')],
      handler: async ({ body, params: { userId }, req }) => {
        const { email, permissions, roles } = body;
        await uniqueMiddleware(email, { userId, req });
        await dataCheck({ permissions, roles, req });

        await req.scope.cradle.adminUserService.update(userId, body);

        const data = userEntryResponse(
          (await User.scope(['aliases', 'customFields', 'permissions', 'roles']).findByPk(
            userId,
          )) as User,
        );

        return { status: 200, body: data };
      },
    },
    destroy: {
      middleware: [permission('acl', 'users', 'users|delete')],
      handler: async ({ params: { userId }, req }) => {
        await req.scope.cradle.adminUserService.destroy(userId);

        return { status: 204, body: undefined };
      },
    },
    permissions: {
      middleware: [permission('acl', 'users', 'users|permissions')],
      handler: async ({ params: { userId }, query }) => {
        const user = await User.findByPk(userId, { attributes: ['id'] });
        if (!user)
          throw new NotFoundError();

        const permissions = await Permission.paginate({
          query,
          columns: ['name', 'displayName'],
          include: [{ association: 'userLinks', attributes: ['userId'], where: { userId } }],
          order: [['name', 'ASC']],
        });

        return { status: 200, body: permissions };
      },
    },
    roles: {
      middleware: [permission('acl', 'users', 'users|roles')],
      handler: async ({ params: { userId }, query }) => {
        const user = await User.findByPk(userId, { attributes: ['id'] });
        if (!user)
          throw new NotFoundError();

        const roles = await Role.paginate({
          query,
          columns: ['name', 'displayName'],
          include: [{ association: 'userLinks', attributes: ['userId'], where: { userId } }],
          order: [['name', 'ASC']],
        });

        return { status: 200, body: roles };
      },
    },
  });
}
