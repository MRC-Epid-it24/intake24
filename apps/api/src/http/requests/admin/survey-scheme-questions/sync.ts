import { checkSchema } from 'express-validator';
import { isPlainObject } from 'lodash';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { isMealSection, isSurveySection } from '@intake24/common/schemes';

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
    question: {
      in: ['body'],
      custom: {
        options: async (value, meta): Promise<void> => {
          if (
            !isPlainObject(value) ||
            ['id', 'name', 'type', 'component', 'props'].some((key) => !(key in value)) ||
            ['id', 'name', 'type', 'component'].some((key) => typeof value[key] !== 'string')
          )
            throw new Error(customTypeErrorMessage('structure._', meta));
        },
      },
    },
  })
);
