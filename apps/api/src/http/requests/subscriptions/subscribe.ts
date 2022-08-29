import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';
import { validatePushSubscription } from '@intake24/common/validators';

export default validate(
  checkSchema({
    subscription: {
      in: ['body'],
      errorMessage: typeErrorMessage('structure._'),
      custom: {
        options: (value): boolean => {
          validatePushSubscription(value);
          return true;
        },
      },
    },
  })
);
