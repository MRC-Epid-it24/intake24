import { Request } from 'express';
import { Schema } from 'express-validator';
import { isPlainObject, has } from 'lodash';
import { Op, WhereOptions } from 'sequelize';
import { User } from '@api/db/models/system';
import { unique } from '@api/http/rules';
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
    isEmail: true,
    optional: { options: { nullable: true } },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { userId } = (req as Request).params;
        const except: WhereOptions = userId ? { id: { [Op.ne]: userId } } : {};

        return unique({ model: User, condition: { field: 'email', value }, except });
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

        Promise.resolve();
      },
    },
  },
};

export const password: Schema = {
  password: {
    in: ['body'],
    errorMessage: 'Enter a valid password, at least 8 chars length.',
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 8 } },
  },
  passwordConfirm: {
    in: ['body'],
    errorMessage: 'Enter a valid password, at least 8 chars length.',
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 8 } },
    custom: {
      options: async (value, { req }): Promise<void> => {
        return value === req.body.password
          ? Promise.resolve()
          : Promise.reject(new Error(`Passwords don't match.`));
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
    isBoolean: true,
    optional: { options: { nullable: true } },
  },
  smsNotifications: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: true,
    optional: { options: { nullable: true } },
  },
  multiFactorAuthentication: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: true,
    optional: { options: { nullable: true } },
  },
};
