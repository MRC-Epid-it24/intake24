import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    password: {
      in: ['body'],
      errorMessage: 'Enter a valid password, at least 8 chars length.',
      isString: true,
      isEmpty: { negated: true },
      isLength: { options: { min: 8 } },
    },
    passwordConfirm: {
      in: ['body'],
      errorMessage: 'Enter a valid password, at least 8 chars length.',
      isString: true,
      isEmpty: { negated: true },
      isLength: { options: { min: 8 } },
      custom: {
        options: async (value, { req }): Promise<void> => {
          return value === req.body.password
            ? Promise.resolve()
            : Promise.reject(new Error(`Passwords don't match.`));
        },
      },
    },
  })
);
