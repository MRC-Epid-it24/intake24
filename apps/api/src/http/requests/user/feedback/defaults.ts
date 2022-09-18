import type { Schema } from 'express-validator';

import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';

const defaults: Schema = {
  survey: {
    in: ['query'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
  },
  submissions: {
    in: ['query'],
    optional: true,
    custom: {
      options: async (value, meta): Promise<void> => {
        if (!Array.isArray(value) || value.some((item) => !item || typeof item !== 'string'))
          throw new Error(customTypeErrorMessage('array.string', meta));
      },
    },
  },
};

export default defaults;
