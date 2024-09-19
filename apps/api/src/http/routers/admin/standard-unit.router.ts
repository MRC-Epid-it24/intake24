import type { AppRoute, AppRouter } from '@ts-rest/core';
import type { TsRestRequest } from '@ts-rest/express';
import { initServer } from '@ts-rest/express';
import { col, fn, literal, where } from 'sequelize';

import { ForbiddenError, NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import { customTypeValidationMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { contract } from '@intake24/common/contracts';
import {
  CategoryLocal,
  CategoryPortionSizeMethod,
  FoodLocal,
  FoodPortionSizeMethod,
  StandardUnit,
  SystemLocale,
} from '@intake24/db';

async function getLocaleMap(code: string[]) {
  if (!code.length)
    return {};

  const locales = await SystemLocale.findAll({ attributes: ['id', 'code'], where: { code } });
  return locales.reduce<Record<string, string>>((acc, locale) => {
    acc[locale.code] = locale.id;
    return acc;
  }, {});
}

async function uniqueMiddleware<T extends AppRoute | AppRouter>(value: any, { req }: { req: TsRestRequest<T> }) {
  if (!(await unique({ model: StandardUnit, condition: { field: 'id', value } }))) {
    throw new ValidationError(customTypeValidationMessage('unique._', { req, path: 'id' }), {
      path: 'id',
    });
  }
}

export function standardUnit() {
  return initServer().router(contract.admin.standardUnit, {
    browse: {
      middleware: [permission('standard-units', 'standard-units|browse')],
      handler: async ({ query }) => {
        const standardUnits = await StandardUnit.paginate({
          query,
          columns: ['id', 'name'],
          order: [[fn('lower', col('id')), 'ASC']],
        });

        return { status: 200, body: standardUnits };
      },
    },
    store: {
      middleware: [permission('standard-units', 'standard-units|create')],
      handler: async ({ body, req }) => {
        await uniqueMiddleware(body.id, { req });

        const standardUnit = await StandardUnit.create(body);

        return { status: 201, body: standardUnit };
      },
    },
    read: {
      middleware: [permission('standard-units', 'standard-units|read')],
      handler: async ({ params: { standardUnitId } }) => {
        const standardUnit = await StandardUnit.findByPk(standardUnitId);
        if (!standardUnit)
          throw new NotFoundError();

        return { status: 200, body: standardUnit };
      },
    },
    update: {
      middleware: [permission('standard-units', 'standard-units|edit')],
      handler: async ({ body, params: { standardUnitId } }) => {
        const standardUnit = await StandardUnit.findByPk(standardUnitId);
        if (!standardUnit)
          throw new NotFoundError();

        await standardUnit.update(body);

        return { status: 200, body: standardUnit };
      },
    },
    destroy: {
      middleware: [permission('standard-units', 'standard-units|delete')],
      handler: async ({ params: { standardUnitId } }) => {
        const standardUnit = await StandardUnit.findByPk(standardUnitId);
        if (!standardUnit)
          throw new NotFoundError();

        const [categoryPsm, foodPsm] = await Promise.all([
          CategoryPortionSizeMethod.findOne({
            attributes: ['id'],
            where: where(
              literal(`parameters::jsonb`),
              '@>',
              `{"units":[{"name": "${standardUnitId}"}]}`,
            ),
          }),
          FoodPortionSizeMethod.findOne({
            attributes: ['id'],
            where: where(
              literal(`parameters::jsonb`),
              '@>',
              `{"units":[{"name": "${standardUnitId}"}]}`,
            ),
          }),
        ]);

        if (categoryPsm || foodPsm) {
          throw new ForbiddenError(
            'Standard unit cannot be deleted. There are categories/foods using this standard unit.',
          );
        }

        await standardUnit.destroy();

        return { status: 204, body: undefined };
      },
    },
    categories: {
      middleware: [permission('standard-units', 'standard-units|categories')],
      handler: async ({ params, query }) => {
        const { standardUnitId } = params;

        const standardUnit = await StandardUnit.findByPk(standardUnitId, { attributes: ['id'] });
        if (!standardUnit)
          throw new NotFoundError();

        const categories = await CategoryLocal.paginate({
          query,
          columns: ['categoryCode', 'name'],
          subQuery: false,
          include: [
            {
              association: 'portionSizeMethods',
              attributes: ['id'],
              where: where(
                literal(`parameters::jsonb`),
                '@>',
                `{"units":[{"name": "${standardUnitId}"}]}`,
              ),
              required: true,
            },
          ],
          order: [['categoryCode', 'ASC']],
        });

        const localeMap = await getLocaleMap([
          ...new Set(categories.data.map(({ localeId }) => localeId)),
        ]);

        categories.data = categories.data.map(item => ({
          ...item.get(),
          localeCode: item.localeId,
          localeId: localeMap[item.localeId],
        }));

        return { status: 200, body: categories };
      },
    },
    foods: {
      middleware: [permission('standard-units', 'standard-units|foods')],
      handler: async ({ params, query }) => {
        const { standardUnitId } = params;

        const standardUnit = await StandardUnit.findByPk(standardUnitId, { attributes: ['id'] });
        if (!standardUnit)
          throw new NotFoundError();

        const foods = await FoodLocal.paginate({
          query,
          columns: ['foodCode', 'name'],
          subQuery: false,
          include: [
            {
              association: 'portionSizeMethods',
              attributes: ['id'],
              where: where(
                literal(`parameters::jsonb`),
                '@>',
                `{"units":[{"name": "${standardUnitId}"}]}`,
              ),
              required: true,
            },
          ],
          order: [['foodCode', 'ASC']],
        });

        const localeMap = await getLocaleMap([
          ...new Set(foods.data.map(({ localeId }) => localeId)),
        ]);

        foods.data = foods.data.map(item => ({
          ...item.get(),
          localeCode: item.localeId,
          localeId: localeMap[item.localeId],
        }));

        return { status: 200, body: foods };
      },
    },
  });
}
