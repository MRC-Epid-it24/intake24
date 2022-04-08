import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import { unique } from '@intake24/api/http/rules';
import { SurveyScheme } from '@intake24/db';

export default validate(
  checkSchema({
    name: {
      in: ['body'],
      errorMessage: 'Survey scheme name must be unique.',
      isString: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: SurveyScheme, condition: { field: 'name', value } }),
      },
    },
  })
);
