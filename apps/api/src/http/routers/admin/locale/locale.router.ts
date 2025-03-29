import type { AppRoute, AppRouter } from '@ts-rest/core';

import type { TsRestRequest } from '@ts-rest/express';
import type { ModelStatic, WhereOptions } from 'sequelize';
import path from 'node:path';
import { initServer } from '@ts-rest/express';
import { pick } from 'lodash';
import multer from 'multer';
import { col, fn } from 'sequelize';

import languageBackends from '@intake24/api/food-index/language-backends';
import { ForbiddenError, NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import { customTypeValidationMessage } from '@intake24/api/http/requests/util';
import { localeResponse } from '@intake24/api/http/responses/admin';
import { unique } from '@intake24/api/http/rules';
import ioc from '@intake24/api/ioc';
import { contract } from '@intake24/common/contracts';
import { jobRequiresFile } from '@intake24/common/types';
import { multerFile } from '@intake24/common/types/http';
import type { PaginateOptions } from '@intake24/db';
import { FoodsLocale, Language, Op, securableScope, SystemLocale } from '@intake24/db';

async function uniqueMiddleware<T extends AppRoute | AppRouter>(value: any, { localeId, field, req }: { localeId?: string; field: string; req: TsRestRequest<T> }) {
  const where: WhereOptions = localeId ? { id: { [Op.ne]: localeId } } : {};

  if (!(await unique({ model: SystemLocale, condition: { field, value }, options: { where } }))) {
    throw new ValidationError(customTypeValidationMessage('unique._', { req, path: field }), {
      code: '$unique',
      path: field,
    });
  }
}

async function checkVisibility<T extends AppRoute | AppRouter>(values: Partial<Record<'respondentLanguageId' | 'adminLanguageId' | 'prototypeLocaleId', string | null | undefined>>, req: TsRestRequest<T>, locale?: SystemLocale) {
  const models: Record<string, ModelStatic<any>> = {
    respondentLanguageId: Language,
    adminLanguageId: Language,
    prototypeLocaleId: SystemLocale,
  };

  for (const [key, value] of Object.entries(values)) {
    const keyName = key as 'respondentLanguageId' | 'adminLanguageId' | 'prototypeLocaleId';

    if (!value || (locale && locale[keyName] === value))
      continue;

    try {
      await req.scope.cradle.aclService.findAndCheckVisibility(
        models[keyName],
        'use',
        { attributes: ['id', 'ownerId', 'visibility'], where: { code: value } },
      );
    }
    catch {
      throw new ValidationError(customTypeValidationMessage('restricted._', { req, path: key }), { path: key, code: '$restricted' });
    }
  }
}

export function locale() {
  const upload = multer({ dest: ioc.cradle.fsConfig.local.uploads });

  return initServer().router(contract.admin.locale.locale, {
    browse: {
      middleware: [permission('locales')],
      handler: async ({ query, req }) => {
        const {
          aclService,
          user: { userId },
        } = req.scope.cradle;

        const paginateOptions: PaginateOptions = {
          query,
          columns: ['code', 'englishName', 'localName'],
          order: [[fn('lower', col('Locale.code')), 'ASC']],
        };

        if (await aclService.hasPermission('locales:browse')) {
          const locales = await SystemLocale.paginate(paginateOptions);
          return { status: 200, body: locales };
        }

        const locales = await SystemLocale.paginate({
          ...paginateOptions,
          where: { [Op.or]: { ownerId: userId, '$securables.action$': ['read', 'edit', 'delete'] } },
          ...securableScope(userId),
          subQuery: false,
        });

        return { status: 200, body: locales };
      },
    },
    store: {
      middleware: [permission('locales', 'locales:create')],
      handler: async ({ body, req }) => {
        await Promise.all([
          uniqueMiddleware(body.code, { field: 'code', req }),
          uniqueMiddleware(body.englishName, { field: 'englishName', req }),
          uniqueMiddleware(body.localName, { field: 'localName', req }),
          checkVisibility(pick(body, ['respondentLanguageId', 'adminLanguageId', 'prototypeLocaleId']), req),
        ]);

        const { userId } = req.scope.cradle.user;

        const { code, ...rest } = body;
        const foodsInput = { id: code, ...rest };

        const [locale] = await Promise.all([
          SystemLocale.create({ ...body, ownerId: userId }),
          FoodsLocale.create(foodsInput),
        ]);

        if (body.foodIndexEnabled)
          await req.scope.cradle.cache.push('indexing-locales', locale.id);

        return { status: 201, body: localeResponse(locale) };
      },
    },
    refs: {
      middleware: [permission('locales')],
      handler: async () => {
        const languageToFlagMap: Record<string, string> = {
          en: 'gb', // English -> UK flag
          fr: 'fr', // French -> France flag
          zh: 'cn', // Chinese -> China flag
          ta: 'in', // Tamil -> India flag
          'ar-AE': 'ae', // Arabic (UAE) -> UAE flag
          ja: 'jp', // Japanese -> Japan flag
        };

        const foodIndexLanguageBackends = Object.entries(languageBackends).map(([id, { name }]) => ({
          id,
          name,
          flagCode: languageToFlagMap[id] || id,
        }));

        const locales = await SystemLocale.scope('list').findAll();

        return { status: 200, body: { foodIndexLanguageBackends, locales } };
      },
    },
    read: {
      middleware: [permission('locales')],
      handler: async ({ params: { localeId }, req }) => {
        const locale = await req.scope.cradle.aclService.findAndCheckRecordAccess(SystemLocale, 'read', {
          where: { id: localeId },
          include: [
            { association: 'parent' },
            { association: 'adminLanguage' },
            { association: 'respondentLanguage' },
          ],
        });

        return { status: 200, body: localeResponse(locale) };
      },
    },
    getByCode: {
      middleware: [permission('locales')],
      handler: async ({ params: { code }, req }) => {
        const locale = await req.scope.cradle.aclService.findAndCheckRecordAccess(SystemLocale, 'read', {
          where: { code },
        });

        return { status: 200, body: localeResponse(locale) };
      },
    },
    update: {
      middleware: [permission('locales')],
      handler: async ({ body, params: { localeId }, req }) => {
        await Promise.all([
          uniqueMiddleware(body.englishName, { field: 'englishName', localeId, req }),
          uniqueMiddleware(body.localName, { field: 'localName', localeId, req }),
          checkVisibility(pick(body, ['respondentLanguageId', 'adminLanguageId', 'prototypeLocaleId']), req),
        ]);

        const { aclService } = req.scope.cradle;

        const systemLocale = await aclService.findAndCheckRecordAccess(SystemLocale, 'edit', {
          where: { id: localeId },
          include: [
            { association: 'parent' },
            { association: 'adminLanguage' },
            { association: 'respondentLanguage' },
          ],
        });
        const foodsLocale = await FoodsLocale.findByPk(systemLocale.code);
        if (!foodsLocale)
          throw new NotFoundError();

        if (body.foodIndexEnabled && !systemLocale.foodIndexEnabled)
          await req.scope.cradle.cache.push('indexing-locales', localeId);

        await Promise.all([systemLocale.update(body), foodsLocale.update(body)]);

        await systemLocale.reload({
          include: [
            { association: 'parent' },
            { association: 'adminLanguage' },
            { association: 'respondentLanguage' },
          ],
        });

        return { status: 200, body: localeResponse(systemLocale) };
      },
    },
    destroy: {
      middleware: [permission('locales')],
      handler: async ({ params: { localeId }, req }) => {
        const systemLocale = await req.scope.cradle.aclService.findAndCheckRecordAccess(SystemLocale, 'delete', {
          attributes: ['id', 'code'],
          where: { id: localeId },
          include: [{ association: 'surveys', attributes: ['id'] }],
        });
        const foodsLocale = await FoodsLocale.findByPk(systemLocale.code);
        if (!systemLocale.surveys || !foodsLocale)
          throw new NotFoundError();

        if (systemLocale.surveys.length)
          throw new ForbiddenError('Locale cannot be deleted. There are surveys using this locale.');

        // TODO: implement locale deletion -> check what needs to be deleted in food DB
        // Food DB locale record + all local food records
        throw new ForbiddenError('Locale cannot be deleted.');

        // await Promise.all([systemLocale.destroy(), foodsLocale.destroy()]);
        // return { status: 204, body: undefined };
      },
    },
    tasks: {
      middleware: [permission('locales'), upload.single('params[file]')],
      handler: async ({ file, params: { localeId }, body, req }) => {
        const {
          aclService,
          localeService,
          user: { userId },
        } = req.scope.cradle;

        const params = { ...body.params, localeId };
        const { type } = body;

        if (jobRequiresFile(type)) {
          if (!file) {
            throw new ValidationError(
              customTypeValidationMessage('file._', { req, path: 'params.file' }),
              { path: 'params.file' },
            );
          }

          const res = multerFile.safeParse(file);
          if (!res.success) {
            throw new ValidationError(
              customTypeValidationMessage('file._', { req, path: 'params.file' }),
              { path: 'params.file' },
            );
          }

          if (path.extname(res.data.originalname).toLowerCase() !== '.csv') {
            throw new ValidationError(
              customTypeValidationMessage(
                'file.ext',
                { req, path: 'params.file' },
                { ext: 'CSV (comma-delimited)' },
              ),
              { path: 'params.file' },
            );
          }

          // @ts-expect-error not narrowed yet
          params.file = res.data.path;
        }

        await aclService.findAndCheckRecordAccess(SystemLocale, 'tasks', {
          attributes: ['id'],
          where: { id: localeId },
        });

        const job = await localeService.queueTask({
          userId,
          type,
          params,
        });

        return { status: 200, body: job };
      },
    },
  });
}
