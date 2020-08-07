import { checkSchema } from 'express-validator';
import { User } from '@/db/models/system';
import validate from '@/http/requests/validate';
import recaptcha from '@/http/rules/recaptcha';

export default validate(
  checkSchema({
    email: {
      in: ['body'],
      errorMessage: 'Email must be filled in.',
      isString: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> => {
          const user = User.findOne({ where: { email: value } });

          return user
            ? Promise.resolve()
            : Promise.reject(new Error('Invalid account information provided.'));
        },
      },
    },
    recaptcha: {
      in: ['body'],
      custom: {
        options: async (value): Promise<void> => recaptcha(value),
      },
    },
  })
);
