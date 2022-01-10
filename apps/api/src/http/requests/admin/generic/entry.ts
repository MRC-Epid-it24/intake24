import { checkSchema } from 'express-validator';
import validate, { ValidationMiddleware } from '@intake24/api/http/requests/validate';

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
