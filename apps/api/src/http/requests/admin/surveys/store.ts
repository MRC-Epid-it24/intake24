import { checkSchema } from 'express-validator';
import slugify from 'slugify';
import { Survey } from '@api/db/models/system';
import validate from '@api/http/requests/validate';
import { identifierSafeChars, unique } from '@api/http/rules';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Survey ID must be unique string (charset [a-zA-Z0-9-_]).',
      isString: true,
      isEmpty: { negated: true },
      isWhitelisted: { options: identifierSafeChars },
      custom: {
        options: async (value): Promise<void> =>
          unique({
            model: Survey,
            condition: { field: 'id', value: slugify(value, { strict: true }) },
          }),
      },
      customSanitizer: {
        options: (value) => (typeof value === 'string' ? slugify(value, { strict: true }) : value),
      },
    },
  })
);
