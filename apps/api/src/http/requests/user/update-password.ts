import { checkSchema } from 'express-validator';

import { password } from '@intake24/api/http/requests/admin/users/defaults';
import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    passwordCurrent: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
    ...password,
  })
);
