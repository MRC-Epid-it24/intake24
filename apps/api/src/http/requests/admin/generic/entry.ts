import { checkSchema } from 'express-validator';

import type { ValidationMiddleware } from '@intake24/api/http/requests/util';
import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default (param: string): ValidationMiddleware[] => {
  return validate(
    checkSchema({
      [param]: {
        in: ['params'],
        errorMessage: typeErrorMessage('int._'),
        isInt: true,
      },
    }),
  );
};
