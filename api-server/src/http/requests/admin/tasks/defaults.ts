import { Request } from 'express';
import { Schema } from 'express-validator';
import { Op, WhereOptions } from 'sequelize';
import { Task } from '@/db/models/system';
import { cron, jobExists, unique } from '@/http/rules';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Name must be filled in.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { taskId } = (req as Request).params;
        const except: WhereOptions = taskId ? { id: { [Op.ne]: taskId } } : {};

        return unique({ model: Task, condition: { field: 'name', value }, except });
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
};

export default defaults;
