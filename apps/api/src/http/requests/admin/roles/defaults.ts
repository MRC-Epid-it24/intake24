import { Request } from 'express';
import { Schema } from 'express-validator';
import { Op, WhereOptions } from 'sequelize';
import { Role } from '@api/db/models/system';
import { identifierSafeChars, unique } from '@api/http/rules';
import { RoleAttributes } from '@common/types/models';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Internal name must be filled in (charset [a-zA-Z0-9-_]).',
    isString: true,
    isEmpty: { negated: true },
    isWhitelisted: { options: identifierSafeChars },
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
