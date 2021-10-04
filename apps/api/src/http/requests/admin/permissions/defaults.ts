import { Request } from 'express';
import { Schema } from 'express-validator';
import { Op, WhereOptions } from 'sequelize';
import { Permission } from '@api/db/models/system';
import { unique } from '@api/http/rules';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Name must be filled in.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { permissionId } = (req as Request).params;
        const except: WhereOptions = permissionId ? { id: { [Op.ne]: permissionId } } : {};

        return unique({ model: Permission, condition: { field: 'name', value }, except });
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
