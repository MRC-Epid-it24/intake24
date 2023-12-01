import type { ParamSchema } from 'express-validator';
import { isNaN, toNumber } from 'lodash';

import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { recordVisibilities } from '@intake24/common/security';
import { Permission, Role } from '@intake24/db';

export const permissions: ParamSchema = {
  in: ['body'],
  custom: {
    options: async (value, meta): Promise<void> => {
      if (!Array.isArray(value) || value.some((item) => isNaN(toNumber(item))))
        throw new Error(customTypeErrorMessage('array.number', meta));

      if (!value.length) Promise.resolve();

      const availablePermissions = await Permission.count({ where: { id: value } });
      if (availablePermissions !== value.length)
        throw new Error(customTypeErrorMessage('exists', meta));
    },
  },
};

export const roles: ParamSchema = {
  in: ['body'],
  custom: {
    options: async (value, meta): Promise<void> => {
      if (!Array.isArray(value) || value.some((item) => isNaN(toNumber(item))))
        throw new Error(customTypeErrorMessage('array.number', meta));

      if (!value.length) Promise.resolve();

      const availableRoles = await Role.count({ where: { id: value } });
      if (availableRoles !== value.length) throw new Error(customTypeErrorMessage('exists', meta));
    },
  },
};

export const visibility: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('in.options', { options: recordVisibilities }),
  isString: true,
  isIn: { options: [recordVisibilities] },
  optional: true,
};
