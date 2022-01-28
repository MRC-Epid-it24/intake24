import { Request } from 'express';
import { ParamSchema, Schema } from 'express-validator';
import has from 'lodash/has';
import validator from 'validator';
import { Op, WhereOptions, FeedbackScheme } from '@intake24/db';
import { FeedbackSchemeAttributes } from '@intake24/common/types/models';
import { unique } from '@intake24/api/http/rules';
import { feedbackTypes } from '@intake24/common/feedback';

export const name: ParamSchema = {
  in: ['body'],
  errorMessage: 'Feedback scheme name must be unique.',
  isString: true,
  isEmpty: { negated: true },
  custom: {
    options: async (value, { req }): Promise<void> => {
      const { feedbackSchemeId } = (req as Request).params;
      const where: WhereOptions<FeedbackSchemeAttributes> = feedbackSchemeId
        ? { id: { [Op.ne]: feedbackSchemeId } }
        : {};

      return unique({
        model: FeedbackScheme,
        condition: { field: 'name', value },
        options: { where },
      });
    },
  },
};

export const defaults: Schema = {
  type: {
    in: ['body'],
    errorMessage: 'Enter valid feedback scheme type.',
    isString: true,
    isEmpty: { negated: true },
    isIn: { options: [feedbackTypes] },
  },
  'topFoods.max': {
    in: ['body'],
    errorMessage: 'Top foods number must be integer',
    isInt: true,
    toInt: true,
  },
  'topFoods.colors': {
    in: ['body'],
    custom: {
      options: async (value): Promise<void> => {
        if (
          !Array.isArray(value) ||
          value.some((item) => typeof item !== 'string' || !validator.isHexColor(item))
        )
          throw new Error('Colors must be a list of valid color codes.');
      },
    },
  },
  'topFoods.nutrientTypes': {
    in: ['body'],
    custom: {
      options: async (value): Promise<void> => {
        if (
          !Array.isArray(value) ||
          value.some(
            (item) => !has(item, 'id') || !has(item, 'name.en') || typeof item.id !== 'string'
          )
        )
          throw new Error('Invalid nutrient types list.');

        const nutrientTypeIds = value.map(({ id }) => id);
        if (nutrientTypeIds.length !== [...new Set(nutrientTypeIds)].length)
          throw new Error('Duplicate nutrient types Ids in the list.');
      },
    },
  },
};
