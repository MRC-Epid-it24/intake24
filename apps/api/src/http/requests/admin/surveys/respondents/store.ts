import type { Request } from 'express';
import { checkSchema } from 'express-validator';

import validate from '@intake24/api/http/requests/validate';
import { UserSurveyAlias } from '@intake24/db';

import { identifiers, password } from '../../users/defaults';

export default validate(
  checkSchema({
    ...identifiers,
    ...password,
    username: {
      in: ['body'],
      errorMessage: 'Username must be a unique string (no emails).',
      isString: { bail: true },
      isEmail: { negated: true, bail: true },
      custom: {
        options: async (value, { req }): Promise<void> => {
          const { surveyId } = (req as Request).params;

          const entry = await UserSurveyAlias.findOne({ where: { surveyId, username: value } });
          if (entry) throw new Error('Current username is already in use within this study.');
        },
      },
    },
  })
);
