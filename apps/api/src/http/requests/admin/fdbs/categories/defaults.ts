import { Request } from 'express';
import { Schema } from 'express-validator';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { unique } from '@api/http/rules';
import { Category, CategoryLocal } from '@api/db/models/foods';

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
    isBoolean: true,
  },
};

export default defaults;
