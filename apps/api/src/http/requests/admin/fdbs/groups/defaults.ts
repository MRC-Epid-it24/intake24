import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { FoodGroupAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { unique } from '@intake24/api/http/rules';
import { FoodGroup, Op } from '@intake24/db';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Enter unique food group name.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { foodGroupId } = (req as Request).params;
        const where: WhereOptions<FoodGroupAttributes> = foodGroupId
          ? { id: { [Op.ne]: foodGroupId } }
          : {};

        return unique({
          model: FoodGroup,
          condition: { field: 'name', value },
          options: { where },
        });
      },
    },
  },
};

export default defaults;
