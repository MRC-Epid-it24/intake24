import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    email: {
      in: ['body'],
      errorMessage: 'Enter valid email address.',
      isEmail: true,
      toLowerCase: true,
    },
    emailConfirm: {
      in: ['body'],
      errorMessage: 'Email addresses do not match.',
      isEmail: true,
      toLowerCase: true,
      custom: { options: (value, { req }) => value === req.body.email },
    },
  })
);
