import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { PermissionAttributes, WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { identifierSafeChars } from '@intake24/common/rules';
import { Op, Permission } from '@intake24/db';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 128 }),
    isString: { bail: true },
    isLength: { bail: true, options: { max: 128 } },
    isEmpty: { negated: true, bail: true },
    isWhitelisted: {
      options: `${identifierSafeChars}|`,
      bail: true,
      errorMessage: typeErrorMessage('safeChars._'),
    },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { permissionId } = (meta.req as Request).params;
        const where: WhereOptions<PermissionAttributes> = permissionId
          ? { id: { [Op.ne]: permissionId } }
          : {};

        if (
          !(await unique({
            model: Permission,
            condition: { field: 'name', value },
            options: { where },
          }))
        )
          throw new Error(customTypeErrorMessage('unique._', meta));
      },
    },
  },
  displayName: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 128 }),
    isString: true,
    isEmpty: { negated: true },
    isLength: { bail: true, options: { max: 128 } },
  },
  description: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    optional: { options: { nullable: true } },
  },
};

export default defaults;
