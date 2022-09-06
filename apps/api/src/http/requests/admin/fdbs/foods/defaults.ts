import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { FindOptions, WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { FoodGroup, FoodLocal, Op } from '@intake24/db';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.minMax', { min: 3, max: 256 }),
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 3, max: 256 } },
  },
  'main.name': {
    in: ['body'],
    errorMessage: typeErrorMessage('string.minMax', { min: 3, max: 128 }),
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 3, max: 128 } },
  },
  'main.code': {
    in: ['body'],
    errorMessage: typeErrorMessage('string.minMax', { min: 1, max: 8 }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    isLength: { options: { min: 1, max: 8 }, bail: true },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { localeId, foodId } = (meta.req as Request).params;
        const where: WhereOptions<FoodLocal> = foodId
          ? { localeId, id: { [Op.ne]: foodId } }
          : { localeId };

        const options: FindOptions<FoodLocal> = {
          where,
          include: [{ association: 'main', attributes: [], required: true }],
        };

        if (!(await unique({ model: FoodLocal, condition: { field: 'foodCode', value }, options })))
          throw new Error(customTypeErrorMessage('unique._', meta));
      },
    },
  },
  'main.foodGroupId': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, meta): Promise<void> => {
        const foodGroup = await FoodGroup.findByPk(value);
        if (!foodGroup) throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
  },
};

export default defaults;
