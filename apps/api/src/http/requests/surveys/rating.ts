import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { surveyRatings } from '@intake24/common/surveys';
import { SurveySubmission } from '@intake24/db/models';

export default validate(
  checkSchema({
    type: {
      in: ['body'],
      errorMessage: typeErrorMessage('in.options', { options: surveyRatings }),
      isString: true,
      isIn: { options: [surveyRatings] },
    },
    comment: {
      in: ['body'],
      errorMessage: typeErrorMessage('string.max', { max: 500 }),
      isString: true,
      isLength: { options: { max: 500 } },
      optional: { options: { nullable: true } },
    },
    rating: {
      in: ['body'],
      errorMessage: typeErrorMessage('int.minMax', { min: 1, max: 5 }),
      isInt: { options: { min: 1, max: 5 } },
      toInt: true,
    },
    submissionId: {
      in: ['body'],
      errorMessage: typeErrorMessage('uuid._'),
      isUUID: true,
      optional: { options: { nullable: true } },
      custom: {
        options: async (value, meta): Promise<void> => {
          const submission = await SurveySubmission.findByPk(value, { attributes: ['id'] });
          if (!submission) throw new Error(customTypeErrorMessage('exists._', meta));
        },
      },
    },
  })
);
