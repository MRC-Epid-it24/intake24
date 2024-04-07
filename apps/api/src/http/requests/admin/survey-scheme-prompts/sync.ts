import { checkSchema } from 'express-validator';
import { isPlainObject } from 'lodash';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { isMealSection, isSurveySection } from '@intake24/common/surveys';

export default validate(
  checkSchema({
    surveySchemeId: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
    section: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value, meta): Promise<void> => {
          if (!isSurveySection(value) && !isMealSection(value))
            throw new Error(customTypeErrorMessage('in._', meta));
        },
      },
    },
    prompt: {
      in: ['body'],
      custom: {
        options: async (value, meta): Promise<void> => {
          if (
            !isPlainObject(value)
            || ['id', 'name', 'type', 'component'].some(
              key => !(key in value) || typeof value[key] !== 'string',
            )
          )
            throw new Error(customTypeErrorMessage('structure._', meta));
        },
      },
    },
  }),
);
