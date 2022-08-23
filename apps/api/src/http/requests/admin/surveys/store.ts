import { checkSchema } from 'express-validator';
import slugify from 'slugify';

import validate from '@intake24/api/http/requests/validate';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { Survey } from '@intake24/db';

import { defaults, surveySchemeOverrides } from './defaults';

export default validate(
  checkSchema({
    slug: {
      in: ['body'],
      errorMessage: 'Survey ID must be unique string (charset [a-zA-Z0-9-_]).',
      isString: { bail: true },
      isEmpty: { negated: true, bail: true },
      isWhitelisted: { options: identifierSafeChars, bail: true },
      custom: {
        options: async (value): Promise<void> =>
          unique({
            model: Survey,
            condition: { field: 'slug', value: slugify(value, { strict: true }) },
          }),
        bail: true,
      },
      customSanitizer: {
        options: (value) => (typeof value === 'string' ? slugify(value, { strict: true }) : value),
      },
    },
    ...defaults,
    surveySchemeOverrides,
  })
);
