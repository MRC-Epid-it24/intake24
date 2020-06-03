import { checkSchema } from 'express-validator';
import slugify from 'slugify';
import Scheme from '@/db/models/system/scheme';
import validate from '@/http/requests/validate';
import unique from '@/http/rules/unique';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Scheme ID must be unique string',
      isString: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value, meta): Promise<void> => {
          return unique({ model: Scheme, field: 'id', value: slugify(value) }, meta);
        },
      },
      customSanitizer: {
        options: (value) => (typeof value === 'string' ? slugify(value) : value),
      },
    },
  })
);
