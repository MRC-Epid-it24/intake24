import { checkSchema } from 'express-validator';
import { isPlainObject } from 'lodash';
import validate from '@intake24/api/http/requests/validate';

export default validate(
  checkSchema({
    sessionData: {
      in: ['body'],
      errorMessage: 'Missing session data.',
      custom: {
        options: async (value: any): Promise<void> => {
          // TODO: add proper validator once SurveyState implementation finalized in frontend
          if (!isPlainObject(value)) throw new Error('Enter valid session data object.');
        },
      },
    },
  })
);
