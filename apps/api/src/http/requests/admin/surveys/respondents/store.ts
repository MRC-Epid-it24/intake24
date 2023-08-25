import type { Request } from 'express';
import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { UserSurveyAlias } from '@intake24/db';

import { identifiers, password } from '../../users/defaults';

export default validate(
  checkSchema({
    ...identifiers,
    ...password,
    username: {
      in: ['body'],
      errorMessage: typeErrorMessage('string.max', { max: 256 }),
      isString: { bail: true },
      isLength: { bail: true, options: { max: 256 } },
      isEmail: { negated: true, bail: true },
      custom: {
        options: async (value, meta): Promise<void> => {
          const { surveyId } = (meta.req as Request).params;

          const entry = await UserSurveyAlias.findOne({ where: { surveyId, username: value } });
          if (entry) throw new Error(customTypeErrorMessage('unique._', meta));
        },
      },
    },
  })
);
