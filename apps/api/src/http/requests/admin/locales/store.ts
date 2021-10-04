import { checkSchema } from 'express-validator';
import { Locale } from '@api/db/models/system';
import validate from '@api/http/requests/validate';
import { unique } from '@api/http/rules';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Locale ID must be unique locale code.',
      isLocale: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: Locale, condition: { field: 'id', value } }),
      },
    },
  })
);
