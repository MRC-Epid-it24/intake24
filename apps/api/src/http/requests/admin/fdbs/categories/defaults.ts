import type { Request } from 'express';
import type { Schema } from 'express-validator';
import { FindOptions, Op, WhereOptions, Category, CategoryLocal } from '@intake24/db';
import { unique } from '@intake24/api/http/rules';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Enter local category name.',
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 3, max: 256 } },
  },
  'main.name': {
    in: ['body'],
    errorMessage: 'Enter global category name.',
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 3, max: 128 } },
  },
  'main.code': {
    in: ['body'],
    errorMessage: 'Enter unique category code.',
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 1, max: 8 } },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { localeId, categoryId } = (req as Request).params;
        const where: WhereOptions<CategoryLocal> = categoryId
          ? { localeId, id: { [Op.ne]: categoryId } }
          : { localeId };

        const options: FindOptions<CategoryLocal> = {
          where,
          include: [{ model: Category, attributes: [], required: true }],
        };

        return unique({
          model: CategoryLocal,
          condition: { field: 'categoryCode', value },
          options,
        });
      },
    },
  },
  'main.isHidden': {
    in: ['body'],
    errorMessage: 'Enter true/false values.',
    isBoolean: { options: { strict: true } },
  },
};

export default defaults;
