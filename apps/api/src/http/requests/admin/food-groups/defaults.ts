import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { FoodGroupAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { FoodGroup, Op } from '@intake24/db';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { foodGroupId } = (meta.req as Request).params;
        const where: WhereOptions<FoodGroupAttributes> = foodGroupId
          ? { id: { [Op.ne]: foodGroupId } }
          : {};

        if (
          !(await unique({
            model: FoodGroup,
            condition: { field: 'name', value },
            options: { where },
          }))
        )
          throw new Error(customTypeErrorMessage('unique._', meta));
      },
    },
  },
};

export default defaults;
