import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { Op, User } from '@intake24/db';

export default validate(
  checkSchema({
    ownerId: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: { bail: true },
      optional: { options: { nullable: true } },
      custom: {
        options: async (value, meta): Promise<void> => {
          const user = User.findOne({
            attributes: ['id'],
            where: { id: value, email: { [Op.ne]: null } },
          });
          if (!user) throw new Error(customTypeErrorMessage('exists._', meta));
        },
      },
    },
  })
);
