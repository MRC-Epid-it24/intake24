import type { Request } from 'express';
import type { ParamSchema, Schema } from 'express-validator';
import has from 'lodash/has';
import validator from 'validator';

import type { FeedbackSchemeAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import {
  feedbackOutputs,
  feedbackPhysicalDataFields,
  feedbackTypes,
} from '@intake24/common/feedback';
import { validateDemographicGroups, validateHenryCoefficients } from '@intake24/common/validators';
import { FeedbackScheme, Op } from '@intake24/db';

export const name: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string._'),
  isString: { bail: true },
  isEmpty: { negated: true, bail: true },
  custom: {
    options: async (value, meta): Promise<void> => {
      const { feedbackSchemeId } = (meta.req as Request).params;
      const where: WhereOptions<FeedbackSchemeAttributes> = feedbackSchemeId
        ? { id: { [Op.ne]: feedbackSchemeId } }
        : {};

      if (
        !(await unique({
          model: FeedbackScheme,
          condition: { field: 'name', value },
          options: { where },
        }))
      )
        throw new Error(customTypeErrorMessage('unique._', meta));
    },
  },
};

export const defaults: Schema = {
  type: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isEmpty: { negated: true },
    isIn: {
      options: [feedbackTypes],
      errorMessage: typeErrorMessage('in.options', { options: feedbackTypes }),
    },
  },
  outputs: {
    in: ['body'],
    errorMessage: typeErrorMessage('array._'),
    isArray: { bail: true },
    custom: {
      options: async (value: any[], meta): Promise<void> => {
        if (value.some((action) => !feedbackOutputs.includes(action)))
          throw new Error(customTypeErrorMessage('in.options', meta, { options: feedbackOutputs }));
      },
    },
  },
  physicalDataFields: {
    in: ['body'],
    errorMessage: typeErrorMessage('array._'),
    isArray: { bail: true },
    custom: {
      options: async (value: any[], meta): Promise<void> => {
        if (value.some((action) => !feedbackPhysicalDataFields.includes(action)))
          throw new Error(
            customTypeErrorMessage('in.options', meta, { options: feedbackPhysicalDataFields })
          );
      },
    },
  },
  'topFoods.max': {
    in: ['body'],
    errorMessage: typeErrorMessage('int._'),
    isInt: true,
    toInt: true,
  },
  'topFoods.colors': {
    in: ['body'],
    errorMessage: typeErrorMessage('array._'),
    isArray: { bail: true },
    custom: {
      options: async (value: any[], meta): Promise<void> => {
        if (value.some((item) => typeof item !== 'string' || !validator.isHexColor(item)))
          throw new Error(customTypeErrorMessage('array.colors', meta));
      },
    },
  },
  'topFoods.nutrientTypes': {
    in: ['body'],
    errorMessage: typeErrorMessage('array._'),
    isArray: { bail: true },
    custom: {
      options: async (value: any[], meta): Promise<void> => {
        if (
          value.some(
            (item) => !has(item, 'id') || !has(item, 'name.en') || typeof item.id !== 'string'
          )
        )
          throw new Error(customTypeErrorMessage('structure._', meta));

        const nutrientTypeIds = value.map(({ id }) => id);
        if (nutrientTypeIds.length !== [...new Set(nutrientTypeIds)].length)
          throw new Error(customTypeErrorMessage('duplicate._', meta));
      },
    },
  },
  henryCoefficients: {
    in: ['body'],
    errorMessage: typeErrorMessage('structure._'),
    custom: {
      options: (value): boolean => {
        try {
          validateHenryCoefficients(value);
          return true;
        } catch (err: any) {
          throw new Error(err.message.split('\n')[0]);
        }
      },
    },
  },
  demographicGroups: {
    in: ['body'],
    errorMessage: typeErrorMessage('structure._'),
    custom: {
      options: (value): boolean => {
        try {
          validateDemographicGroups(value);
          return true;
        } catch (err: any) {
          throw new Error(err.message.split('\n')[0]);
        }
      },
    },
  },
};
