import { checkSchema } from 'express-validator';
import { NutrientTable } from '@api/db';
import validate from '@api/http/requests/validate';
import { identifierSafeChars, unique } from '@api/http/rules';
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
