import type { Request } from 'express';
import type { Schema } from 'express-validator';
import type { WhereOptions } from '@intake24/db';
import { Op, Permission } from '@intake24/db';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import type { PermissionAttributes } from '@intake24/common/types/models';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Name must be filled in (charset [a-zA-Z0-9-_]).',
    isString: true,
    isEmpty: { negated: true },
    isWhitelisted: { options: `${identifierSafeChars}|` },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { permissionId } = (req as Request).params;
        const where: WhereOptions<PermissionAttributes> = permissionId
          ? { id: { [Op.ne]: permissionId } }
          : {};

        return unique({
          model: Permission,
          condition: { field: 'name', value },
          options: { where },
        });
      },
    },
  },
  displayName: {
    in: ['body'],
    errorMessage: 'Display name must be filled in.',
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
