import { checkSchema } from 'express-validator';
import slugify from 'slugify';
import { Survey } from '@/db/models/system';
import validate from '@/http/requests/validate';
import unique from '@/http/rules/unique';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Survey ID must be unique string.',
      isString: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: Survey, condition: { field: 'id', value: slugify(value), ci: true } }),
      },
      customSanitizer: {
        options: (value) => (typeof value === 'string' ? slugify(value) : value),
      },
    },
  })
);
