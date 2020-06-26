import { Schema } from 'express-validator';
import User from '@/db/models/system/user';
import unique from '@/http/rules/unique';
import { roleList } from '@/services/acl.service';

export default {
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
      options: async (value, meta): Promise<void> => {
        return unique({ model: User, field: 'email', value }, meta);
      },
    },
  },
  phone: {
    in: ['body'],
    errorMessage: 'Phone must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
  roles: {
    in: ['body'],
    custom: {
      options: async (value): Promise<void> => {
        const roles = await roleList();
        return Array.isArray(value) &&
          value.every((item) => typeof item === 'string' && roles.includes(item))
          ? Promise.resolve()
          : Promise.reject(new Error('Enter a valid list of strings.'));
      },
    },
  },
  emailNotifications: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: true,
  },
  smsNotifications: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: true,
  },
  multiFactorAuthentication: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: true,
  },
} as Schema;
