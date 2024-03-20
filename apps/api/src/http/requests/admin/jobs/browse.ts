import { checkSchema } from 'express-validator';

import { paginate } from '@intake24/api/http/requests/admin/generic';
import { customTypeErrorMessage, validate } from '@intake24/api/http/requests/util';
import { isValidJob } from '@intake24/common/types';

export default validate(
  checkSchema({
    ...paginate,
    type: {
      in: ['query'],
      optional: { options: { nullable: true } },
      custom: {
        options: async (value, meta): Promise<void> => {
          if (typeof value === 'string' && isValidJob(value)) return;

          if (Array.isArray(value) && value.every((item) => isValidJob(item))) return;

          throw new Error(customTypeErrorMessage('exists._', meta));
        },
      },
    },
    localeId: {
      in: ['query'],
      optional: true,
      isInt: true,
    },
    nutrientTableId: {
      in: ['query'],
      optional: true,
      isInt: true,
    },
    surveyId: {
      in: ['query'],
      optional: true,
      isInt: true,
    },
  })
);
