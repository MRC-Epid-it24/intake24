import { Request } from 'express';
import { checkSchema } from 'express-validator';
import { Op, WhereOptions, User } from '@intake24/db';
import validate from '@intake24/api/http/requests/validate';
import { unique } from '@intake24/api/http/rules';
import { UserAttributes } from '@intake24/common/types/models';
import defaults from './defaults';

export default validate(
  checkSchema({
    name: {
      in: ['body'],
      errorMessage: 'Name must be a string.',
      isString: true,
      optional: { options: { nullable: true } },
    },
    email: {
      in: ['body'],
      errorMessage: 'Enter valid unique email address.',
      isEmail: true,
      custom: {
        options: async (value, { req }): Promise<void> => {
          const { userId } = (req as Request).params;
          const where: WhereOptions<UserAttributes> = userId ? { id: { [Op.ne]: userId } } : {};

          return unique({ model: User, condition: { field: 'email', value }, options: { where } });
        },
      },
      toLowerCase: true,
    },
    phone: {
      in: ['body'],
      errorMessage: 'Phone must be a string.',
      isString: true,
      optional: { options: { nullable: true } },
    },
    ...defaults,
  })
);
