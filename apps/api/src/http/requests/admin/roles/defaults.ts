import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { RoleAttributes, WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { Op, Role } from '@intake24/db';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 128 }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    isLength: { bail: true, options: { max: 128 } },
    isWhitelisted: {
      options: identifierSafeChars,
      bail: true,
      errorMessage: typeErrorMessage('safeChars._'),
    },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { roleId } = (meta.req as Request).params;
        const where: WhereOptions<RoleAttributes> = roleId ? { id: { [Op.ne]: roleId } } : {};

        if (
          !(await unique({ model: Role, condition: { field: 'name', value }, options: { where } }))
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
