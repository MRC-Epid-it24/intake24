import { Request } from 'express';
import { Schema } from 'express-validator';
import { Op, WhereOptions } from 'sequelize';
import { Role } from '@/db/models/system';
import unique from '@/http/rules/unique';

export default {
  name: {
    in: ['body'],
    errorMessage: 'Internal name must be filled in.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { roleId } = (req as Request).params;
        const except: WhereOptions = roleId ? { id: { [Op.ne]: roleId } } : {};

        return unique({ model: Role, condition: { field: 'name', value }, except });
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
} as Schema;
