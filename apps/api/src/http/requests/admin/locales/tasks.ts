import path from 'node:path';

import type { Meta } from 'express-validator';
import { checkSchema } from 'express-validator';
import { isPlainObject } from 'lodash';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { searchSortingAlgorithms } from '@intake24/common/surveys';
import {
  jobHasParam,
  jobRequiresFile,
  localeCopySubTasks,
  localeJobs,
  pickJobParams,
} from '@intake24/common/types';
import { SystemLocale } from '@intake24/db';

export default validate(
  checkSchema({
    type: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isIn: {
        options: [localeJobs],
        errorMessage: typeErrorMessage('in.options', { options: localeJobs }),
      },
    },
    params: {
      in: ['body'],
      customSanitizer: {
        options: (value, { req }) =>
          isPlainObject(value) && req.body.type && localeJobs.includes(req.body.type)
            ? pickJobParams(value, req.body.type)
            : {},
      },
    },
    'params.sourceLocaleId': {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      custom: {
        if: (value: any, { req }: Meta) =>
          req.body.type && ['LocaleCopy'].includes(req.body.type),
        options: async (value, meta): Promise<void> => {
          if (!value || typeof value !== 'string')
            throw new Error('Invalid source locale ID');

          if (value === meta.req.body.params.localeId)
            throw new Error('Source locale ID is same as target locale');

          const locale = await SystemLocale.findByPk(value, { attributes: ['code'] });
          if (!locale)
            throw new Error(customTypeErrorMessage('exists._', meta));
        },
      },
    },
    'params.file': {
      in: ['body'],
      custom: {
        if: (value: any, { req }: Meta) => req.body.type && jobRequiresFile(req.body.type),
        options: async (value, meta): Promise<void> => {
          const { file } = meta.req;
          if (!file)
            throw new Error(customTypeErrorMessage('file._', meta));

          if (path.extname(file.originalname).toLowerCase() !== '.csv') {
            throw new Error(
              customTypeErrorMessage('file.ext', meta, { ext: 'CSV (comma-delimited)' }),
            );
          }
        },
      },
    },
    'params.targetAlgorithm': {
      in: ['body'],
      custom: {
        if: (value: any, { req }: Meta) => req.body.type && jobHasParam(req.body.type, 'targetAlgorithm'),
        options: async (value: any, meta): Promise<void> => {
          if (!searchSortingAlgorithms.includes(value))
            throw new Error(customTypeErrorMessage('in.options', meta, { options: searchSortingAlgorithms }));
        },
      },
    },
    'params.subTasks': {
      in: ['body'],
      errorMessage: typeErrorMessage('array.min', { min: 1 }),
      isArray: {
        bail: true,
        options: { min: 1 },
        if: (value: any, { req }: Meta) =>
          req.body.type && ['LocaleCopy'].includes(req.body.type),
      },
      custom: {
        if: (value: any, { req }: Meta) =>
          req.body.type && ['LocaleCopy'].includes(req.body.type),
        options: async (value: any[], meta): Promise<void> => {
          if (value.some(action => !localeCopySubTasks.includes(action)))
            throw new Error(customTypeErrorMessage('in.options', meta, { options: localeCopySubTasks }));
        },
      },
    },
  }),
);
