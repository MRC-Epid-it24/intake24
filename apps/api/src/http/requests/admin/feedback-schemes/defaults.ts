import type { Request } from 'express';
import type { ParamSchema, Schema } from 'express-validator';
import has from 'lodash/has';
import validator from 'validator';
import { ZodError } from 'zod';

import type { FeedbackSchemeAttributes, WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import {
  demographicGroup,
  feedbackOutputs,
  feedbackPhysicalDataFields,
  feedbackSections,
  feedbackTypes,
  henryCoefficient,
} from '@intake24/common/feedback';
import { FeedbackScheme, Op } from '@intake24/db';

export const name: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string.max', { max: 256 }),
  isString: { bail: true },
  isEmpty: { negated: true, bail: true },
  isLength: { bail: true, options: { max: 256 } },
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
  sections: {
    in: ['body'],
    errorMessage: typeErrorMessage('array._'),
    isArray: { bail: true },
    custom: {
      options: async (value: any[], meta): Promise<void> => {
        if (value.some((action) => !feedbackSections.includes(action)))
          throw new Error(
            customTypeErrorMessage('in.options', meta, { options: feedbackSections })
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
            (item) =>
              !has(item, 'id') ||
              !has(item, 'name.en') ||
              !Array.isArray(item.id) ||
              item.id.some((nid: any) => typeof nid !== 'string')
          )
        )
          throw new Error(customTypeErrorMessage('structure._', meta));

        if (value.some((item) => item.id.length !== [...new Set(item.id)].length))
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
          henryCoefficient.array().parse(value);
          return true;
        } catch (err) {
          if (err instanceof ZodError) {
            throw err.errors.at(0)?.message;
          }
          throw err;
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
          demographicGroup.array().parse(value);
          return true;
        } catch (err) {
          if (err instanceof ZodError) {
            throw err.errors.at(0)?.message;
          }
          throw err;
        }
      },
    },
  },
};
