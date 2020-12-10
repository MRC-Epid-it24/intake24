import { ParamSchema } from 'express-validator';
import { isNaN, toNumber } from 'lodash';
import { Permission, Role } from '@/db/models/system';

export const permissions: ParamSchema = {
  in: ['body'],
  custom: {
    options: async (value): Promise<void> => {
      if (!Array.isArray(value) || value.some((item) => isNaN(toNumber(item))))
        throw new Error('Please enter a list of permission IDs.');

      if (!value.length) Promise.resolve();

      const availablePermissions = await Permission.count({ where: { id: value } });
      if (availablePermissions !== value.length) throw new Error('Invalid permissions.');

      return Promise.resolve();
    },
  },
};

export const roles: ParamSchema = {
  in: ['body'],
  custom: {
    options: async (value): Promise<void> => {
      if (!Array.isArray(value) || value.some((item) => isNaN(toNumber(item))))
        throw new Error('Please enter a list of role IDs.');

      if (!value.length) Promise.resolve();

      const availableRoles = await Role.count({ where: { id: value } });
      if (availableRoles !== value.length) throw new Error('Invalid roles.');

      return Promise.resolve();
    },
  },
};
