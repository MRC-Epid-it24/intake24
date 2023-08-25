import { checkSchema } from 'express-validator';
import slugify from 'slugify';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { Survey } from '@intake24/db';

import { defaults, surveySchemeOverrides } from './defaults';

export default validate(
  checkSchema({
    slug: {
      in: ['body'],
      errorMessage: typeErrorMessage('string.max', { max: 128 }),
      isString: { bail: true },
      isEmpty: { negated: true, bail: true },
      isLength: { bail: true, options: { max: 128 } },
      isWhitelisted: {
        options: identifierSafeChars,
        bail: true,
        errorMessage: typeErrorMessage('safeChars._'),
      },
      custom: {
        options: async (value, meta): Promise<void> => {
          if (
            !(await unique({
              model: Survey,
              condition: { field: 'slug', value: slugify(value, { strict: true }) },
            }))
          )
            throw new Error(customTypeErrorMessage('unique._', meta));
        },
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
