import { checkSchema } from 'express-validator';
import slugify from 'slugify';
import { Survey } from '@intake24/db';
import validate from '@intake24/api/http/requests/validate';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { defaults, surveySchemeOverrides } from './defaults';

export default validate(
  checkSchema({
    slug: {
      in: ['body'],
      errorMessage: 'Survey ID must be unique string (charset [a-zA-Z0-9-_]).',
      isString: true,
      isEmpty: { negated: true },
      isWhitelisted: { options: identifierSafeChars },
      custom: {
        options: async (value): Promise<void> =>
          unique({
            model: Survey,
            condition: { field: 'slug', value: slugify(value, { strict: true }) },
          }),
      },
      customSanitizer: {
        options: (value) => (typeof value === 'string' ? slugify(value, { strict: true }) : value),
      },
    },
    ...defaults,
    surveySchemeOverrides,
  })
);
