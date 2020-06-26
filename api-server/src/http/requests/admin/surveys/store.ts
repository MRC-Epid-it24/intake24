import { checkSchema } from 'express-validator';
import slugify from 'slugify';
import Survey from '@/db/models/system/survey';
import validate from '@/http/requests/validate';
import unique from '@/http/rules/unique';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Survey name must be unique string.',
      isString: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value, meta): Promise<void> => {
          return unique({ model: Survey, field: 'id', value: slugify(value) }, meta);
        },
      },
      customSanitizer: {
        options: (value) => (typeof value === 'string' ? slugify(value) : value),
      },
    },
  })
);
