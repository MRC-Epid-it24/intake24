import { Request } from 'express';
import { Schema } from 'express-validator';
import { isNaN, toNumber } from 'lodash';
import { Op, WhereOptions } from 'sequelize';
import { Permission, Role, User } from '@/db/models/system';
import unique from '@/http/rules/unique';

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

        return unique({ model: User, condition: { field: 'email', value, ci: true }, except });
      },
    },
  },
  phone: {
    in: ['body'],
    errorMessage: 'Phone must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
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
  permissions: {
    in: ['body'],
    custom: {
      options: async (value): Promise<void> => {
        if (!Array.isArray(value) || value.some((item) => isNaN(toNumber(item))))
          throw new Error('Please enter a list of permission IDs.');

        if (!value.length) Promise.resolve();

        const permissions = await Permission.count({ where: { id: value } });
        if (permissions !== value.length) throw new Error('Invalid permissions.');

        return Promise.resolve();
      },
    },
  },
  roles: {
    in: ['body'],
    custom: {
      options: async (value): Promise<void> => {
        if (!Array.isArray(value) || value.some((item) => isNaN(toNumber(item))))
          throw new Error('Please enter a list of role IDs.');

        if (!value.length) Promise.resolve();

        const roles = await Role.count({ where: { id: value } });
        if (roles !== value.length) throw new Error('Invalid roles.');

        return Promise.resolve();
      },
    },
  },
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
