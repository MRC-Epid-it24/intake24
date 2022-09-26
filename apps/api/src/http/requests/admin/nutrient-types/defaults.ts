import type { Schema } from 'express-validator';

import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { FoodsNutrientUnit, SystemNutrientUnit } from '@intake24/db';

const defaults: Schema = {
  description: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
  },
  unitId: {
    in: ['body'],
    errorMessage: typeErrorMessage('int._'),
    isInt: { bail: true },
    custom: {
      options: async (value, meta): Promise<void> => {
        const [foodsNutrientUnit, systemNutrientUnit] = await Promise.all([
          FoodsNutrientUnit.findByPk(value),
          SystemNutrientUnit.findByPk(value),
        ]);

        if (!foodsNutrientUnit || !systemNutrientUnit)
          throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
  },
  kcalPerUnit: {
    in: ['body'],
    errorMessage: typeErrorMessage('float._'),
    isFloat: { bail: true },
    optional: { options: { nullable: true } },
  },
};

export default defaults;
