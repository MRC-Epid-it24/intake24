import type { Meta } from 'express-validator';
import { parsePhoneNumber } from 'awesome-phonenumber';
import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    name: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
    email: {
      in: ['body'],
      errorMessage: typeErrorMessage('email._'),
      isEmail: {
        if: (value: any, { req }: Meta) => !!value || !req.body.phone,
      },
      toLowerCase: true,
      custom: {
        options: async (value: any, meta): Promise<void> => {
          if (!value && !meta.req.body.phone)
            throw new Error(
              customTypeErrorMessage('either._', meta, { one: 'email', two: 'phone' })
            );
        },
      },
    },
    phone: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: {
        if: (value: any, { req }: Meta) => !!value || !req.body.email,
      },
      custom: {
        options: async (value: any, meta): Promise<void> => {
          if (!value && !meta.req.body.email)
            throw new Error(
              customTypeErrorMessage('either._', meta, { one: 'email', two: 'phone' })
            );

          if (!parsePhoneNumber(value).valid)
            throw new Error(customTypeErrorMessage('phone._', meta));
        },
      },
    },
    message: {
      in: ['body'],
      errorMessage: typeErrorMessage('string.max', { max: 500 }),
      isString: true,
      isLength: { options: { max: 500 } },
      optional: { options: { nullable: true } },
    },
  })
);
