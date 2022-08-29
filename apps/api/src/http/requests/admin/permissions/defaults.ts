import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { PermissionAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { Op, Permission } from '@intake24/db';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
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
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isEmpty: { negated: true },
  },
  description: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    optional: { options: { nullable: true } },
  },
};

export default defaults;
