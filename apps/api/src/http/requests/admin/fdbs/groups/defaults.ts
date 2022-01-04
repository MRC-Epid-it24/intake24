import { Request } from 'express';
import { Schema } from 'express-validator';
import { Op, WhereOptions, FoodGroup } from '@intake24/db';
import { FoodGroupAttributes } from '@common/types/models';
import { unique } from '@api/http/rules';

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
