import { checkSchema } from 'express-validator';
import { password } from '@/http/requests/admin/users/defaults';
import validate from '@/http/requests/validate';

export default validate(
  checkSchema({
    ...password,
    email: {
      in: ['body'],
      errorMessage: 'Email must be filled in.',
      isEmail: true,
      isEmpty: { negated: true },
      normalizeEmail: { options: { all_lowercase: true } },
    },
    token: {
      in: ['body'],
      errorMessage: 'Verification token must be provided.',
      isString: true,
      isEmpty: { negated: true },
    },
  })
);
