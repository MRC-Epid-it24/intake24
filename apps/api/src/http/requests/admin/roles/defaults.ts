import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { RoleAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { Op, Role } from '@intake24/db';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Internal name must be filled in (charset [a-zA-Z0-9-_]).',
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    isWhitelisted: { options: identifierSafeChars, bail: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { roleId } = (req as Request).params;
        const where: WhereOptions<RoleAttributes> = roleId ? { id: { [Op.ne]: roleId } } : {};

        return unique({ model: Role, condition: { field: 'name', value }, options: { where } });
      },
    },
  },
  displayName: {
    in: ['body'],
    errorMessage: 'Name must be filled in.',
    isString: true,
    isEmpty: { negated: true },
  },
  description: {
    in: ['body'],
    errorMessage: 'Enter a valid string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
};

export default defaults;
