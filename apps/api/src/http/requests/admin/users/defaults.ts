import type { Request } from 'express';
import type { ParamSchema, Schema } from 'express-validator';
import { has, isPlainObject } from 'lodash';

import type { UserAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { Op, User } from '@intake24/db';

import { permissions, roles } from '../acl';

export const email: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('email._'),
  isEmail: { bail: true },
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
  errorMessage: typeErrorMessage('string._'),
  isString: true,
};

export const nameOptional: ParamSchema = {
  ...name,
  optional: { options: { nullable: true } },
};

export const phone: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string._'),
  isString: true,
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
    optional: { options: { nullable: true } },
  },
  smsNotifications: {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: { options: { nullable: true } },
  },
  multiFactorAuthentication: {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: { options: { nullable: true } },
  },
};
