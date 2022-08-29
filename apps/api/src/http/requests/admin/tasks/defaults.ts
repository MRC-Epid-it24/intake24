import type { Request } from 'express';
import type { Schema } from 'express-validator';
import { isPlainObject } from 'lodash';

import type { TaskAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { cron, unique } from '@intake24/api/http/rules';
import { jobTypes } from '@intake24/common/types';
import { Op, Task } from '@intake24/db';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { taskId } = (meta.req as Request).params;
        const where: WhereOptions<TaskAttributes> = taskId ? { id: { [Op.ne]: taskId } } : {};

        if (
          !(await unique({ model: Task, condition: { field: 'name', value }, options: { where } }))
        )
          throw new Error(customTypeErrorMessage('unique._', meta));
      },
    },
  },
  job: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isEmpty: { negated: true },
    isString: true,
    isIn: { options: [jobTypes], errorMessage: typeErrorMessage('in._') },
  },
  cron: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isEmpty: { negated: true },
    isString: true,
    custom: { options: cron },
  },
  active: {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    toBoolean: true,
  },
  description: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    optional: { options: { nullable: true } },
  },
  params: {
    in: ['body'],
    errorMessage: 'Parameters must be valid object.',
    isEmpty: { negated: true },
    custom: {
      options: async (value): Promise<void> => {
        if (!isPlainObject(value)) throw new Error('Parameters must be valid object.');
        // TODO: add full json validation for each job type
      },
    },
  },
};

export default defaults;
