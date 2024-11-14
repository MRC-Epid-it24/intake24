import type { AppRoute, AppRouter } from '@ts-rest/core';
import type { TsRestRequest } from '@ts-rest/express';
import { initServer } from '@ts-rest/express';

import { ValidationError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import { customTypeValidationMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { contract } from '@intake24/common/contracts';
import type { NutrientTypeResponse } from '@intake24/common/types/http/admin';
import {
  FoodsNutrientType,
  FoodsNutrientUnit,
  SystemNutrientType,
  SystemNutrientUnit,
} from '@intake24/db';

function toNutrientTypeResponse(nutrientType: FoodsNutrientType): NutrientTypeResponse {
  const { id, description, unitId, unit, inKcal } = nutrientType;
  return { id, description, unitId, unit, kcalPerUnit: inKcal?.kcalPerUnit };
}

async function uniqueMiddleware<T extends AppRoute | AppRouter>(value: string, req: TsRestRequest<T>) {
  const [foodsNutrientType, systemNutrientType] = await Promise.all([
    unique({ model: FoodsNutrientType, condition: { field: 'id', value, ci: false } }),
    unique({ model: SystemNutrientType, condition: { field: 'id', value, ci: false } }),
  ]);

  if (!foodsNutrientType || !systemNutrientType) {
    throw new ValidationError(customTypeValidationMessage('unique._', { req, path: 'id' }), {
      path: 'id',
    });
  }
}

async function unitIdMiddleware<T extends AppRoute | AppRouter>(unitId: string, req: TsRestRequest<T>) {
  const [foodsNutrientUnit, systemNutrientUnit] = await Promise.all([
    FoodsNutrientUnit.findByPk(unitId, { attributes: ['id'] }),
    SystemNutrientUnit.findByPk(unitId, { attributes: ['id'] }),
  ]);

  if (!foodsNutrientUnit || !systemNutrientUnit) {
    throw new ValidationError(customTypeValidationMessage('exists._', { req, path: 'unitId' }), {
      path: 'unitId',
    });
  }
}

export function nutrientType() {
  return initServer().router(contract.admin.nutrientType, {
    browse: {
      middleware: [permission('nutrient-types', 'nutrient-types:browse')],
      handler: async ({ query }) => {
        const nutrientTypes = await FoodsNutrientType.paginate({
          query,
          columns: ['description'],
          include: [{ association: 'unit', attributes: ['description'] }],
          order: [['id', 'ASC']],
        });

        return { status: 200, body: nutrientTypes };
      },
    },
    store: {
      middleware: [permission('nutrient-types', 'nutrient-types:create')],
      handler: async ({ body, req }) => {
        await uniqueMiddleware(body.id, req);
        await unitIdMiddleware(body.unitId, req);

        const nutrientType = await req.scope.cradle.nutrientTypeService.createNutrientType(body);

        return { status: 201, body: toNutrientTypeResponse(nutrientType) };
      },
    },
    refs: {
      middleware: [permission('nutrient-types')],
      handler: async () => {
        const units = await FoodsNutrientUnit.findAll();

        return { status: 200, body: { units } };
      },
    },
    read: {
      middleware: [permission('nutrient-types', 'nutrient-types:read')],
      handler: async ({ params: { nutrientTypeId }, req }) => {
        const nutrientType
          = await req.scope.cradle.nutrientTypeService.getNutrientType(nutrientTypeId);

        return { status: 200, body: toNutrientTypeResponse(nutrientType) };
      },
    },
    update: {
      middleware: [permission('nutrient-types', 'nutrient-types:edit')],
      handler: async ({ body, params: { nutrientTypeId }, req }) => {
        await unitIdMiddleware(body.unitId, req);

        const nutrientType = await req.scope.cradle.nutrientTypeService.updateNutrientType(
          nutrientTypeId,
          body,
        );

        return { status: 200, body: toNutrientTypeResponse(nutrientType) };
      },
    },
    destroy: {
      middleware: [permission('nutrient-types', 'nutrient-types:delete')],
      handler: async ({ params: { nutrientTypeId }, req }) => {
        await req.scope.cradle.nutrientTypeService.deleteNutrientType(nutrientTypeId);

        return { status: 204, body: undefined };
      },
    },
  });
}
