import { checkSchema } from 'express-validator';
import { isPlainObject } from 'lodash';

import { validate } from '@intake24/api/http/requests/util';
import { isMealSection, isSurveySection } from '@intake24/common/schemes';

export default validate(
  checkSchema({
    surveySchemeId: {
      in: ['body'],
      errorMessage: 'Survey scheme ID is missing.',
      isString: true,
      isEmpty: { negated: true },
    },
    section: {
      in: ['body'],
      errorMessage: 'Invalid scheme section.',
      isString: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> => {
          if (!isSurveySection(value) && !isMealSection(value))
            throw new Error('Invalid scheme section.');
        },
      },
    },
    question: {
      in: ['body'],
      custom: {
        options: async (value): Promise<void> => {
          if (
            !isPlainObject(value) ||
            ['id', 'name', 'type', 'component', 'props'].some((key) => !(key in value)) ||
            ['id', 'name', 'type', 'component'].some((key) => typeof value[key] !== 'string')
          )
            throw new Error('Invalid scheme question properties.');
        },
      },
    },
  })
);
