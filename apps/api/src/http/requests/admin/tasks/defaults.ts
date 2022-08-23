import type { Request } from 'express';
import type { Schema } from 'express-validator';
import { isPlainObject } from 'lodash';

import type { TaskAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { cron, unique } from '@intake24/api/http/rules';
import { jobTypes } from '@intake24/common/types';
import { Op, Task } from '@intake24/db';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Name must be filled in.',
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { taskId } = (req as Request).params;
        const where: WhereOptions<TaskAttributes> = taskId ? { id: { [Op.ne]: taskId } } : {};

        return unique({ model: Task, condition: { field: 'name', value }, options: { where } });
      },
    },
  },
  job: {
    in: ['body'],
    errorMessage: 'Invalid JOB entry.',
    isEmpty: { negated: true },
    isString: true,
    isIn: { options: [jobTypes] },
  },
  cron: {
    in: ['body'],
    errorMessage: 'Invalid CRON entry.',
    isEmpty: { negated: true },
    isString: true,
    custom: { options: cron },
  },
  active: {
    in: ['body'],
    errorMessage: 'Active field needs can only be true/false.',
    isBoolean: { options: { strict: true } },
    toBoolean: true,
  },
  description: {
    in: ['body'],
    errorMessage: 'Enter a valid string.',
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
