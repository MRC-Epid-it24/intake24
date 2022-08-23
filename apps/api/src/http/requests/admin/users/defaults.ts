import type { Request } from 'express';
import type { Schema } from 'express-validator';
import { has, isPlainObject } from 'lodash';

import type { UserAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { unique } from '@intake24/api/http/rules';
import { Op, User } from '@intake24/db';

import { permissions, roles } from '../acl';

export const identifiers: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Name must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
  email: {
    in: ['body'],
    errorMessage: 'Enter valid unique email address.',
    isEmail: { bail: true },
    optional: { options: { nullable: true } },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { userId } = (req as Request).params;
        const where: WhereOptions<UserAttributes> = userId ? { id: { [Op.ne]: userId } } : {};

        return unique({ model: User, condition: { field: 'email', value }, options: { where } });
      },
    },
    toLowerCase: true,
  },
  phone: {
    in: ['body'],
    errorMessage: 'Phone must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
  customFields: {
    in: ['body'],
    errorMessage: 'Enter valid custom field object.',
    optional: { options: { nullable: true } },
    custom: {
      options: async (value: any): Promise<void> => {
        if (
          !Array.isArray(value) ||
          value.some((item) => !isPlainObject(item) || !has(item, 'name') || !has(item, 'value'))
        )
          throw new Error('Enter valid custom field object.');
      },
    },
  },
};

export const password: Schema = {
  password: {
    in: ['body'],
    errorMessage: 'Password must contain at least 10 chars of lower/upper chars and numbers.',
    isString: true,
    isStrongPassword: {
      options: { minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
    },
  },
  passwordConfirm: {
    in: ['body'],
    errorMessage: 'Password must contain at least 10 chars of lower/upper chars and numbers.',
    isString: true,
    isStrongPassword: {
      options: { minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
    },
    custom: {
      options: async (value, { req }): Promise<void> => {
        if (value !== req.body.password) throw new Error(`Passwords don't match.`);
      },
    },
  },
};

export const user: Schema = {
  permissions,
  roles,
  emailNotifications: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: { options: { strict: true } },
    optional: { options: { nullable: true } },
  },
  smsNotifications: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: { options: { strict: true } },
    optional: { options: { nullable: true } },
  },
  multiFactorAuthentication: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: { options: { strict: true } },
    optional: { options: { nullable: true } },
  },
};
