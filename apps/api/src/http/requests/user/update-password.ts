import { checkSchema } from 'express-validator';
import { password } from '@intake24/api/http/requests/admin/users/defaults';
import validate from '@intake24/api/http/requests/validate';

export default validate(
  checkSchema({
    passwordCurrent: {
      in: ['body'],
      errorMessage: 'Enter your current valid password.',
      isString: true,
      isEmpty: { negated: true },
    },
    ...password,
  })
);
