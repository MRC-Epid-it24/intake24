import { checkSchema } from 'express-validator';
import validate, { ValidationMiddlerware } from '@/http/requests/validate';

export default (param: string): ValidationMiddlerware[] => {
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
