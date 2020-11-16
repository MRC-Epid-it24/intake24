import { checkSchema } from 'express-validator';
import slugify from 'slugify';
import { Scheme } from '@/db/models/system';
import validate from '@/http/requests/validate';
import { unique } from '@/http/rules';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Scheme ID must be unique string.',
      isString: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: Scheme, condition: { field: 'id', value: slugify(value), ci: true } }),
      },
      customSanitizer: {
        options: (value) => (typeof value === 'string' ? slugify(value) : value),
      },
    },
  })
);
