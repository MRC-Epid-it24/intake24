import { checkSchema } from 'express-validator';
import type { ValidationMiddleware } from '@intake24/api/http/requests/validate';
import validate from '@intake24/api/http/requests/validate';

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
