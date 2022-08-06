import { checkSchema } from 'express-validator';

import validate from '@intake24/api/http/requests/validate';
import { emailCopy } from '@intake24/common/types';

export default validate(
  checkSchema({
    email: {
      in: ['body'],
      errorMessage: 'Enter valid email address.',
      isEmail: true,
      toLowerCase: true,
    },
    copy: {
      in: ['body'],
      errorMessage: 'Enter valid copy action.',
      isString: true,
      isIn: { options: [emailCopy] },
    },
  })
);
