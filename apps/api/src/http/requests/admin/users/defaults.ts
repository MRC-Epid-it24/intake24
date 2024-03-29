import type { Request } from 'express';
import type { ParamSchema, Schema } from 'express-validator';
import { has, isPlainObject } from 'lodash';

import type { UserAttributes, WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { Op, User } from '@intake24/db';

import { permissions, roles } from '../generic';

export const email: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('email._'),
  isEmail: { bail: true },
  isLength: {
    bail: true,
    options: { max: 512 },
    errorMessage: typeErrorMessage('string.max', { max: 512 }),
  },
  custom: {
    options: async (value, meta): Promise<void> => {
      const { userId } = (meta.req as Request).params;
      const where: WhereOptions<UserAttributes> = userId ? { id: { [Op.ne]: userId } } : {};

      if (
        !(await unique({ model: User, condition: { field: 'email', value }, options: { where } }))
      )
        throw new Error(customTypeErrorMessage('unique._', meta));
    },
  },
  toLowerCase: true,
};

export const emailOptional: ParamSchema = {
  ...email,
  optional: { options: { nullable: true } },
};

export const emailConfirm: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('email._'),
  isEmail: { bail: true },
  custom: {
    options: async (value, meta): Promise<void> => {
      if (value !== meta.req.body.email)
        throw new Error(customTypeErrorMessage('match._', meta, { match: 'email' }));
    },
  },
};

export const name: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string.max', { max: 512 }),
  isString: true,
  isLength: { options: { max: 512 } },
};

export const nameOptional: ParamSchema = {
  ...name,
  optional: { options: { nullable: true } },
};

export const phone: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string.max', { max: 32 }),
  isString: true,
  isLength: { options: { max: 32 } },
};

export const phoneOptional: ParamSchema = {
  ...phone,
  optional: { options: { nullable: true } },
};

export const customFields: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('structure._'),
  optional: { options: { nullable: true } },
  custom: {
    options: async (value: any): Promise<void> => {
      if (
        !Array.isArray(value) ||
        value.some((item) => !isPlainObject(item) || !has(item, 'name') || !has(item, 'value'))
      )
        throw new Error();
    },
  },
};

export const identifiers: Schema = {
  email: emailOptional,
  name: nameOptional,
  phone: phoneOptional,
  customFields,
};

export const password: Schema = {
  password: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isStrongPassword: {
      options: { minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
      errorMessage: typeErrorMessage('password._'),
    },
  },
  passwordConfirm: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isStrongPassword: {
      options: { minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
      errorMessage: typeErrorMessage('password._'),
    },
    custom: {
      options: async (value, meta): Promise<void> => {
        if (value !== meta.req.body.password)
          throw new Error(customTypeErrorMessage('match._', meta, { match: 'password' }));
      },
    },
  },
};

export const user: Schema = {
  permissions,
  roles,
  emailNotifications: {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: true,
  },
  smsNotifications: {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: true,
  },
  multiFactorAuthentication: {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: true,
  },
  disabledAt: {
    in: ['body'],
    errorMessage: typeErrorMessage('date._'),
    isISO8601: { options: { strict: true, strictSeparator: true } },
    toDate: true,
    optional: { options: { nullable: true } },
  },
  verifiedAt: {
    in: ['body'],
    errorMessage: typeErrorMessage('date._'),
    isISO8601: { options: { strict: true, strictSeparator: true } },
    toDate: true,
    optional: { options: { nullable: true } },
  },
};
