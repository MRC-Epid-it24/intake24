import { Request } from 'express';
import { Schema } from 'express-validator';
import { isPlainObject } from 'lodash';
import { Op, WhereOptions, Task } from '@intake24/db';
import { cron, jobExists, unique } from '@intake24/api/http/rules';
import { TaskAttributes } from '@intake24/common/types/models';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Name must be filled in.',
    isString: true,
    isEmpty: { negated: true },
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
    custom: { options: jobExists },
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
    isBoolean: true,
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
