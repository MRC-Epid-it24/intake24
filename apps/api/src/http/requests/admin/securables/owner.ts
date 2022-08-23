import { checkSchema } from 'express-validator';

import validate from '@intake24/api/http/requests/validate';
import { Op, User } from '@intake24/db';

export default validate(
  checkSchema({
    ownerId: {
      in: ['body'],
      errorMessage: 'Invalid userId.',
      isString: { bail: true },
      optional: { options: { nullable: true } },
      custom: {
        options: async (value): Promise<void> => {
          const user = User.findOne({ where: { id: value, email: { [Op.ne]: null } } });
          if (!user) throw new Error('Invalid userId.');
        },
      },
    },
  })
);
