import type { Request } from 'express';
import { checkSchema } from 'express-validator';

import type { ValidationMiddleware } from '@intake24/api/http/requests/util';
import type { SecurableType } from '@intake24/common/security';
import type { UserAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { Op, User } from '@intake24/db';

import defaults from './defaults';

export default (securable: SecurableType): ValidationMiddleware[] =>
  validate(
    checkSchema({
      name: {
        in: ['body'],
        errorMessage: typeErrorMessage('string._'),
        isString: true,
        optional: { options: { nullable: true } },
      },
      email: {
        in: ['body'],
        errorMessage: typeErrorMessage('email._'),
        isEmail: { bail: true },
        custom: {
          options: async (value, meta): Promise<void> => {
            const { userId } = (meta.req as Request).params;
            const where: WhereOptions<UserAttributes> = userId ? { id: { [Op.ne]: userId } } : {};

            if (
              !(await unique({
                model: User,
                condition: { field: 'email', value },
                options: { where },
              }))
            )
              throw new Error(customTypeErrorMessage('unique._', meta));
          },
        },
        toLowerCase: true,
      },
      phone: {
        in: ['body'],
        errorMessage: typeErrorMessage('string._'),
        isString: true,
        optional: { options: { nullable: true } },
      },
      ...defaults(securable),
    })
  );
