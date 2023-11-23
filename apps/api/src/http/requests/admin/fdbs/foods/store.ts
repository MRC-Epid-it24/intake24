import type { Request } from 'express';
import { checkSchema } from 'express-validator';

import type { FindOptions, WhereOptions } from '@intake24/db';
import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { FoodGroup, FoodLocal, Op, SystemLocale } from '@intake24/db';

import { categories } from '../common';

export default validate(
  checkSchema({
    name: {
      in: ['body'],
      errorMessage: typeErrorMessage('string.minMax', { min: 3, max: 128 }),
      isString: true,
      isEmpty: { negated: true },
      isLength: { options: { min: 3, max: 128 } },
      optional: true,
    },
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
          if (!locale) throw new Error(customTypeErrorMessage('unique._', meta));

          const where: WhereOptions<FoodLocal> = foodId
            ? { localeId: locale.code, id: { [Op.ne]: foodId } }
            : { localeId: locale.code };

          const options: FindOptions<FoodLocal> = {
            where,
            include: [{ association: 'main', attributes: [], required: true }],
          };

          if (
            !(await unique({ model: FoodLocal, condition: { field: 'foodCode', value }, options }))
          )
            throw new Error(customTypeErrorMessage('unique._', meta));
        },
      },
    },
    foodGroupId: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: { bail: true },
      isEmpty: { negated: true, bail: true },
      optional: true,
      custom: {
        options: async (value, meta): Promise<void> => {
          const foodGroup = await FoodGroup.findByPk(value);
          if (!foodGroup) throw new Error(customTypeErrorMessage('exists._', meta));
        },
      },
    },
    parentCategories: categories,
  })
);
