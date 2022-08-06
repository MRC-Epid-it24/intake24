import { checkSchema } from 'express-validator';

import validate from '@intake24/api/http/requests/validate';
import { validatePushSubscription } from '@intake24/common/validators';

export default validate(
  checkSchema({
    subscription: {
      in: ['body'],
      errorMessage: 'Invalid subscription object.',
      custom: {
        options: (value): boolean => {
          validatePushSubscription(value);
          return true;
        },
      },
    },
  })
);
