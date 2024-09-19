import type { AppRoute, AppRouter } from '@ts-rest/core';
import type { TsRestRequest } from '@ts-rest/express';
import type { WhereOptions } from 'sequelize';
import { initServer } from '@ts-rest/express';
import { col, fn, Op } from 'sequelize';

import { ValidationError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import { customTypeValidationMessage } from '@intake24/api/http/requests/util';
import { languageResponse } from '@intake24/api/http/responses/admin';
import { unique } from '@intake24/api/http/rules';
import { contract } from '@intake24/common/contracts';
import { Language, PaginateOptions, securableScope } from '@intake24/db';

async function uniqueMiddleware<T extends AppRoute | AppRouter>(value: any, { languageId, req }: { languageId?: string; req: TsRestRequest<T> }) {
  const where: WhereOptions = languageId ? { id: { [Op.ne]: languageId } } : {};

  if (!(await unique({ model: Language, condition: { field: 'code', value }, options: { where } }))) {
    throw new ValidationError(customTypeValidationMessage('unique._', { req, path: 'code' }), {
      path: 'code',
    });
  }
}

export function language() {
  return initServer().router(contract.admin.language, {
    browse: {
      middleware: [permission('languages')],
      handler: async ({ query, req }) => {
        const {
          aclService,
          user: { userId },
        } = req.scope.cradle;

        const paginateOptions: PaginateOptions = {
          query,
          columns: ['code', 'englishName', 'localName'],
          order: [[fn('lower', col('Language.code')), 'ASC']],
        };

        if (await aclService.hasPermission('languages|browse')) {
          const languages = await Language.paginate(paginateOptions);
          return { status: 200, body: languages };
        }

        const languages = await Language.paginate({
          ...paginateOptions,
          where: { [Op.or]: { ownerId: userId, '$securables.action$': ['read', 'edit', 'delete'] } },
          ...securableScope(userId),
          subQuery: false,
        });

        return { status: 200, body: languages };
      },
    },
    store: {
      middleware: [permission('languages', 'languages|create')],
      handler: async ({ body, req }) => {
        await uniqueMiddleware(body.code, { req });

        const { userId } = req.scope.cradle.user;

        const language = await req.scope.cradle.languageService.createLanguage(body, userId);

        return { status: 201, body: languageResponse(language) };
      },
    },
    read: {
      middleware: [permission('languages')],
      handler: async ({ params: { languageId }, req }) => {
        const language = await req.scope.cradle.aclService.findAndCheckRecordAccess(Language, 'read', {
          where: { id: languageId },
        });

        return { status: 200, body: languageResponse(language) };
      },
    },
    update: {
      middleware: [permission('languages')],
      handler: async ({ body, params: { languageId }, req }) => {
        const language = await req.scope.cradle.aclService.findAndCheckRecordAccess(Language, 'edit', {
          where: { id: languageId },
        });

        await req.scope.cradle.languageService.updateLanguage(language, body);

        return { status: 200, body: languageResponse(language) };
      },
    },
    destroy: {
      middleware: [permission('languages')],
      handler: async ({ params: { languageId }, req }) => {
        await req.scope.cradle.aclService.findAndCheckRecordAccess(Language, 'delete', {
          attributes: ['id'],
          where: { id: languageId },
        });
        await req.scope.cradle.languageService.deleteLanguage(languageId);

        return { status: 204, body: undefined };
      },
    },
  });
}
