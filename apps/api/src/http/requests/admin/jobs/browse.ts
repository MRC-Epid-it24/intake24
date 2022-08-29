import { checkSchema } from 'express-validator';

import { paginate } from '@intake24/api/http/requests/admin/generic';
import { customTypeErrorMessage, validate } from '@intake24/api/http/requests/util';
import { jobExists } from '@intake24/api/http/rules';

export default validate(
  checkSchema({
    ...paginate,
    type: {
      in: ['query'],
      optional: { options: { nullable: true } },
      custom: {
        options: async (value, meta): Promise<void> => {
          if (typeof value === 'string' && jobExists(value)) return;

          if (Array.isArray(value) && value.every((item) => jobExists(item))) return;

          throw new Error(customTypeErrorMessage('exists._', meta));
        },
      },
    },
  })
);
