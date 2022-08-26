import { checkSchema } from 'express-validator';

import type { ValidationMiddleware } from '@intake24/api/http/requests/util';
import { validate } from '@intake24/api/http/requests/util';

export default (param: string): ValidationMiddleware[] => {
  return validate(
    checkSchema({
      [param]: {
        in: ['params'],
        errorMessage: `Invalid :${param} URL parameter.`,
        isInt: true,
      },
    })
  );
};
