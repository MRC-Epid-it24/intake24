import { Request } from 'express';
import { Schema } from 'express-validator';
import { Op, WhereOptions } from 'sequelize';
import { unique } from '@/http/rules';
import { GuideImage } from '@/db/models/foods';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Enter unique name.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { imageId } = (req as Request).params;
        const except: WhereOptions = imageId ? { id: { [Op.ne]: imageId } } : {};

        return unique({ model: GuideImage, condition: { field: 'id', value }, except });
      },
    },
  },
  description: {
    in: ['body'],
    errorMessage: 'Enter a valid string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
};

export default defaults;
