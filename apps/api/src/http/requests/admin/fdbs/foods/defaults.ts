import type { Request } from 'express';
import type { Schema } from 'express-validator';

import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import type { FindOptions } from '@intake24/db';
import { Food, FoodGroup, Op, SystemLocale } from '@intake24/db';

const defaults: Schema = {
  code: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.minMax', { min: 1, max: 8 }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    isLength: { options: { min: 1, max: 8 }, bail: true },
    optional: true,
    custom: {
      options: async (value, meta): Promise<void> => {
        const { localeId, foodId } = (meta.req as Request).params;

        const locale = await SystemLocale.findByPk(localeId, { attributes: ['code'] });
        if (!locale)
          throw new Error(customTypeErrorMessage('unique._', meta));

        const options: FindOptions<Food> = {
          where: foodId
            ? { localeId: locale.code, id: { [Op.ne]: foodId } }
            : { localeId: locale.code },
        };

        if (!(await unique({ model: Food, condition: { field: 'code', value }, options })))
          throw new Error(customTypeErrorMessage('unique._', meta));
      },
    },
  },
  englishName: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.minMax', { min: 3, max: 128 }),
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 3, max: 128 } },
    optional: true,
  },
  name: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.minMax', { min: 3, max: 256 }),
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 3, max: 256 } },
  },
  foodGroupId: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    optional: true,
    custom: {
      options: async (value, meta): Promise<void> => {
        const foodGroup = await FoodGroup.findByPk(value, { attributes: ['id'] });
        if (!foodGroup)
          throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
  },
};

export default defaults;
