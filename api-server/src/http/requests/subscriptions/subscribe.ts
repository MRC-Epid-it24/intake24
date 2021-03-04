import { checkSchema } from 'express-validator';
import { validatePushSubscription } from '@common/validators';
import validate from '@/http/requests/validate';

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
