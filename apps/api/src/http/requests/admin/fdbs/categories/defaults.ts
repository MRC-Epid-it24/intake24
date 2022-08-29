import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { FindOptions, WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { Category, CategoryLocal, Op } from '@intake24/db';

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
        const { localeId, categoryId } = (meta.req as Request).params;
        const where: WhereOptions<CategoryLocal> = categoryId
          ? { localeId, id: { [Op.ne]: categoryId } }
          : { localeId };

        const options: FindOptions<CategoryLocal> = {
          where,
          include: [{ model: Category, attributes: [], required: true }],
        };

        if (
          !(await unique({
            model: CategoryLocal,
            condition: { field: 'categoryCode', value },
            options,
          }))
        )
          throw new Error(customTypeErrorMessage('unique._', meta));
      },
    },
  },
  'main.isHidden': {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
  },
};

export default defaults;
