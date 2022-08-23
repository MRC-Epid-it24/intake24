import { checkSchema } from 'express-validator';

import validate from '@intake24/api/http/requests/validate';
import { unique } from '@intake24/api/http/rules';
import { SystemLocale } from '@intake24/db';

import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Locale ID must be unique locale code.',
      isLocale: { bail: true },
      isEmpty: { negated: true, bail: true },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: SystemLocale, condition: { field: 'id', value } }),
      },
    },
  })
);
