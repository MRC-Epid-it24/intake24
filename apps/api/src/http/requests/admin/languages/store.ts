import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { Language } from '@intake24/db';

import { visibility } from '../generic';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    code: {
      in: ['body'],
      errorMessage: typeErrorMessage('locale._'),
      isLocale: { bail: true },
      custom: {
        options: async (value, meta): Promise<void> => {
          if (!(await unique({ model: Language, condition: { field: 'code', value } })))
            throw new Error(customTypeErrorMessage('unique._', meta));
        },
      },
    },
    visibility,
  })
);
