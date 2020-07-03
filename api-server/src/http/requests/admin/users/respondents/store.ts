import { Request } from 'express';
import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import UserSurveyAlias from '@/db/models/system/user-survey-alias';
import { identifiers, password } from '../defaults';

export default validate(
  checkSchema({
    ...identifiers,
    ...password,
    userName: {
      in: ['body'],
      errorMessage: 'Username must be a unique string.',
      isString: true,
      custom: {
        options: async (value, { req }): Promise<void> => {
          const { surveyId } = (req as Request).params;
          const entry = await UserSurveyAlias.findOne({ where: { surveyId, userName: value } });
          return entry
            ? Promise.reject(new Error('Current value is already in use.'))
            : Promise.resolve();
        },
      },
    },
  })
);
