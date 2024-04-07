import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';
import { emailCopy } from '@intake24/common/types';

export default validate(
  checkSchema({
    email: {
      in: ['body'],
      errorMessage: typeErrorMessage('email._'),
      isEmail: true,
      toLowerCase: true,
    },
    copy: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isIn: {
        options: [emailCopy],
        errorMessage: typeErrorMessage('string.options', { options: emailCopy }),
      },
    },
  }),
);
