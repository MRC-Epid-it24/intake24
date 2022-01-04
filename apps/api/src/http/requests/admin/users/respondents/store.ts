import { Request } from 'express';
import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';
import { UserSurveyAlias } from '@intake24/db';
import { identifiers, password } from '../defaults';

export default validate(
  checkSchema({
    ...identifiers,
    ...password,
    userName: {
      in: ['body'],
      errorMessage: 'Username must be a unique string (no emails).',
      isString: true,
      isEmail: { negated: true },
      custom: {
        options: async (value, { req }): Promise<void> => {
          const { surveyId } = (req as Request).params;

          const entry = await UserSurveyAlias.findOne({ where: { surveyId, userName: value } });
          if (entry) throw new Error('Current username is already in use within this study.');
        },
      },
    },
  })
);
