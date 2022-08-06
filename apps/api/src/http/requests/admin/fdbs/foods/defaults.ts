import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { FindOptions, WhereOptions } from '@intake24/db';
import { unique } from '@intake24/api/http/rules';
import { Food, FoodGroup, FoodLocal, Op } from '@intake24/db';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Enter local food name.',
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 3, max: 256 } },
  },
  'main.name': {
    in: ['body'],
    errorMessage: 'Enter global food name.',
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 3, max: 128 } },
  },
  'main.code': {
    in: ['body'],
    errorMessage: 'Enter unique food code.',
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 1, max: 8 } },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { localeId, foodId } = (req as Request).params;
        const where: WhereOptions<FoodLocal> = foodId
          ? { localeId, id: { [Op.ne]: foodId } }
          : { localeId };

        const options: FindOptions<FoodLocal> = {
          where,
          include: [{ model: Food, attributes: [], required: true }],
        };

        return unique({ model: FoodLocal, condition: { field: 'foodCode', value }, options });
      },
    },
  },
  'main.foodGroupId': {
    in: ['body'],
    errorMessage: 'Enter valid food code.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value): Promise<void> => {
        const foodGroup = await FoodGroup.findByPk(value);
        if (!foodGroup) throw new Error('Enter valid food code.');
      },
    },
  },
};

export default defaults;
