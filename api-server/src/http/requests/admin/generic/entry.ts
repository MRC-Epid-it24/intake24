import { checkSchema } from 'express-validator';
import validate, { ValidationMiddleware } from '@/http/requests/validate';

export default (param: string): ValidationMiddleware[] => {
  return validate(
    checkSchema({
      [param]: {
        in: ['params'],
        errorMessage: `Invalid :${param} URL parameter.`,
        isInt: true,
        toInt: true,
      },
    })
  );
};
