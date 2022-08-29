import { checkSchema } from 'express-validator';

import { password } from '@intake24/api/http/requests/admin/users/defaults';
import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    ...password,
    email: {
      in: ['body'],
      errorMessage: typeErrorMessage('email._'),
      isEmail: true,
      isEmpty: { negated: true },
      toLowerCase: true,
    },
    token: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
  })
);
