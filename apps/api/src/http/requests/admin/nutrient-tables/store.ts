import { checkSchema } from 'express-validator';
import { NutrientTable } from '@api/db/models/foods';
import validate from '@api/http/requests/validate';
import { unique } from '@api/http/rules';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Nutrient table ID must be unique code.',
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: NutrientTable, condition: { field: 'id', value } }),
      },
    },
  })
);
