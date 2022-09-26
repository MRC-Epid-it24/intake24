import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { FoodsNutrientType, SystemNutrientType } from '@intake24/db';

import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: typeErrorMessage('int._'),
      isInt: { bail: true },
      custom: {
        options: async (value, meta): Promise<void> => {
          const [foodsNutrientType, systemNutrientType] = await Promise.all([
            unique({ model: FoodsNutrientType, condition: { field: 'id', value, ci: false } }),
            unique({ model: SystemNutrientType, condition: { field: 'id', value, ci: false } }),
          ]);

          if (!foodsNutrientType || !systemNutrientType)
            throw new Error(customTypeErrorMessage('unique._', meta));
        },
      },
    },
  })
);
