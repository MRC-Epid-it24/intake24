import { checkSchema } from 'express-validator';
import { isPlainObject } from 'lodash';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    sessionData: {
      in: ['body'],
      errorMessage: typeErrorMessage('structure._'),
      custom: {
        options: async (value: any): Promise<void> => {
          // TODO: add proper validator once SurveyState implementation finalized in frontend
          if (!isPlainObject(value)) throw new Error('Enter valid session data object.');
        },
      },
    },
  })
);
