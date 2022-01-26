import { Request } from 'express';
import { ParamSchema, Schema } from 'express-validator';
import { Op, WhereOptions, FeedbackScheme } from '@intake24/db';
import { FeedbackSchemeAttributes } from '@intake24/common/types/models';
import { unique } from '@intake24/api/http/rules';
import { feedbackTypes } from '@intake24/common/feedback';

export const name: ParamSchema = {
  in: ['body'],
  errorMessage: 'Feedback scheme name must be unique string.',
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
};
