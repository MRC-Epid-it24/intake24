import { checkSchema } from 'express-validator';

import { customTypeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    id: {
      in: ['query'],
      isEmpty: { negated: true },
      custom: {
        options: async (value, meta): Promise<void> => {
          if (typeof value !== 'string' && !Array.isArray(value))
            throw new Error(customTypeErrorMessage('string.or.array', meta));

          if (Array.isArray(value) && value.some((item) => typeof item !== 'string'))
            throw new Error(customTypeErrorMessage('array.string', meta));
        },
      },
    },
  })
);
