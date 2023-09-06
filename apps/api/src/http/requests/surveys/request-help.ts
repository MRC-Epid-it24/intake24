import type { Meta } from 'express-validator';
import { getSupportedRegionCodes, parsePhoneNumber } from 'awesome-phonenumber';
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

          if (!parsePhoneNumber(value, { regionCode: meta.req.body.phoneCountry }).valid)
            throw new Error(customTypeErrorMessage('phone._', meta));
        },
      },
      customSanitizer: {
        options: (value: string, meta) => {
          const phoneNumber = parsePhoneNumber(value, { regionCode: meta.req.body.phoneCountry });
          return phoneNumber.valid ? phoneNumber.number.international : value;
        },
      },
    },
    phoneCountry: {
      in: ['body'],
      isIn: {
        errorMessage: typeErrorMessage('in.options', { options: [] }),
        if: (value: any, meta: Meta) => !!meta.req.body.phone,
        options: [getSupportedRegionCodes()],
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
