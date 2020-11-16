import { checkSchema } from 'express-validator';
import { Language } from '@/db/models/system';
import validate from '@/http/requests/validate';
import { unique } from '@/http/rules';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Language ID must be unique locale code.',
      isLocale: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: Language, condition: { field: 'id', value, ci: true } }),
      },
    },
  })
);
