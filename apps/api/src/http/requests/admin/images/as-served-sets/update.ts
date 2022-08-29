import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';

import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    images: {
      in: ['body'],
      isArray: { bail: true, errorMessage: typeErrorMessage('array._') },
      custom: {
        options: async (value: any[], meta): Promise<void> => {
          if (value.some(({ id, weight }) => typeof id !== 'string' || typeof weight !== 'number'))
            throw new Error(customTypeErrorMessage('structure._', meta));
        },
      },
    },
  })
);
