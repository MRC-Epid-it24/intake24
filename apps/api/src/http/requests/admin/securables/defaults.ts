import type { Request } from 'express';
import type { ParamSchema, Schema } from 'express-validator';

import type { SecurableType } from '@intake24/common/security';
import type { UserAttributes, WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { securableDefs } from '@intake24/common/security';
import { Op, User } from '@intake24/db';

export default (securable: SecurableType): Schema => ({
  actions: {
    in: ['body'],
    errorMessage: typeErrorMessage('array.min', { min: 1 }),
    isArray: { options: { min: 1 }, bail: true },
    custom: {
      options: async (value: any[], meta): Promise<void> => {
        if (value.some(action => !securableDefs[securable].includes(action)))
          throw new Error(customTypeErrorMessage('in._', meta));
      },
    },
  },
});

export const email: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('email._'),
  isEmail: { bail: true },
  isLength: {
    bail: true,
    options: { max: 512 },
    errorMessage: typeErrorMessage('string.max', { max: 512 }),
  },
  custom: {
    options: async (value, meta): Promise<void> => {
      const { userId } = (meta.req as Request).params;
      const where: WhereOptions<UserAttributes> = userId ? { id: { [Op.ne]: userId } } : {};

      if (
        !(await unique({ model: User, condition: { field: 'email', value }, options: { where } }))
      )
        throw new Error(customTypeErrorMessage('unique._', meta));
    },
  },
  toLowerCase: true,
};

export const emailOptional: ParamSchema = {
  ...email,
  optional: { options: { nullable: true } },
};

export const name: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string.max', { max: 512 }),
  isString: true,
  isLength: { options: { max: 512 } },
};

export const nameOptional: ParamSchema = {
  ...name,
  optional: { options: { nullable: true } },
};

export const phone: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string.max', { max: 32 }),
  isString: true,
  isLength: { options: { max: 32 } },
};

export const phoneOptional: ParamSchema = {
  ...phone,
  optional: { options: { nullable: true } },
};
