import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { NutrientTable } from '@intake24/db';

import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: typeErrorMessage('string.max', { max: 32 }),
      isEmpty: { negated: true, bail: true },
      isLength: { bail: true, options: { max: 32 } },
      isWhitelisted: {
        options: identifierSafeChars,
        bail: true,
        errorMessage: typeErrorMessage('safeChars._'),
      },
      custom: {
        options: async (value, meta): Promise<void> => {
          if (!(await unique({ model: NutrientTable, condition: { field: 'id', value } })))
            throw new Error(customTypeErrorMessage('unique._', meta));
        },
      },
    },
  })
);
