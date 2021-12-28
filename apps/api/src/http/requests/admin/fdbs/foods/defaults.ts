import { Request } from 'express';
import { Schema } from 'express-validator';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { unique } from '@api/http/rules';
import { Food, FoodGroup, FoodLocal } from '@api/db/models/foods';

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
