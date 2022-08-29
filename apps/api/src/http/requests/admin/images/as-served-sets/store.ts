import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { AsServedSet } from '@intake24/db';

import { imageFile } from '../../generic';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isEmpty: { negated: true, bail: true },
      isWhitelisted: {
        options: identifierSafeChars,
        bail: true,
        errorMessage: typeErrorMessage('safeChars._'),
      },
      custom: {
        options: async (value, meta): Promise<void> => {
          if (!(await unique({ model: AsServedSet, condition: { field: 'id', value } })))
            throw new Error(customTypeErrorMessage('unique._', meta));
        },
      },
    },
    selectionImage: imageFile,
  })
);
