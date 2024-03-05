import type { Request } from 'express';
import type { Meta, Schema } from 'express-validator';
import { isPlainObject } from 'lodash';

import type { TaskAttributes, WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { cron } from '@intake24/common/rules';
import {
  jobTypes,
  localeJobs,
  nutrientTableJobs,
  pickJobParams,
  surveyJobs,
} from '@intake24/common/types';
import { NutrientTable, Op, Survey, SystemLocale, Task } from '@intake24/db';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 512 }),
    isString: { bail: true },
    isLength: { bail: true, options: { max: 512 } },
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
    isIn: {
      options: [jobTypes],
      errorMessage: typeErrorMessage('in.options', { options: jobTypes }),
    },
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
    custom: {
      options: async (value, meta): Promise<void> => {
        if (!isPlainObject(value) || !meta.req.body.job || !jobTypes.includes(meta.req.body.job))
          throw new Error('Parameters must be a valid object.');
      },
      bail: true,
    },
    customSanitizer: {
      options: (value, { req }) => pickJobParams(value, req.body.job),
    },
  },
  'params.nutrientTableId': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    custom: {
      if: (value: any, { req }: Meta) => req.body.job && nutrientTableJobs.includes(req.body.job),
      options: async (value, meta): Promise<void> => {
        if (!value || typeof value !== 'string') throw new Error();

        const table = await NutrientTable.findByPk(value, { attributes: ['id'] });
        if (!table) throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
  },
  'params.localeId': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    custom: {
      if: (value: any, { req }: Meta) => req.body.job && localeJobs.includes(req.body.job),
      options: async (value, meta): Promise<void> => {
        if (!value || typeof value !== 'string') throw new Error();

        const locale = await SystemLocale.findByPk(value, { attributes: ['code'] });
        if (!locale) throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
  },
  'params.surveyId': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    custom: {
      if: (value: any, { req }: Meta) => req.body.job && surveyJobs.includes(req.body.job),
      options: async (value, meta): Promise<void> => {
        if (!value || typeof value !== 'string') throw new Error();

        const survey = await Survey.findByPk(value, { attributes: ['id'] });
        if (!survey) throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
  },
};

export default defaults;
