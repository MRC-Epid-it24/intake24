import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { SurveyScheme } from '@intake24/db';

export default validate(
  checkSchema({
    name: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: { bail: true },
      isEmpty: { negated: true, bail: true },
      custom: {
        options: async (value, meta): Promise<void> => {
          if (!(await unique({ model: SurveyScheme, condition: { field: 'name', value } })))
            throw new Error(customTypeErrorMessage('unique._', meta));
        },
      },
    },
  })
);
