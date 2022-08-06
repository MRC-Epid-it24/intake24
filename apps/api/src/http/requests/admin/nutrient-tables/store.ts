import { checkSchema } from 'express-validator';

import validate from '@intake24/api/http/requests/validate';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { NutrientTable } from '@intake24/db';

import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Nutrient table ID must be unique code (charset [a-zA-Z0-9-_]).',
      isEmpty: { negated: true },
      isWhitelisted: { options: identifierSafeChars },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: NutrientTable, condition: { field: 'id', value } }),
      },
    },
  })
);
