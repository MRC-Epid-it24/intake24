import type { Request } from 'express';
import type { ParamSchema, Schema } from 'express-validator';
import { isPlainObject } from 'lodash';

import type { SurveyAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { searchSortingAlgorithms, surveyStates } from '@intake24/common/types/models';
import { validateMeals } from '@intake24/common/validators';
import { FeedbackScheme, Op, Survey, SurveyScheme, SystemLocale } from '@intake24/db';

export const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { surveyId } = (meta.req as Request).params;
        const where: WhereOptions<SurveyAttributes> = surveyId ? { id: { [Op.ne]: surveyId } } : {};

        if (
          !(await unique({
            model: Survey,
            condition: { field: 'name', value },
            options: { where },
          }))
        )
          throw new Error(customTypeErrorMessage('unique._', meta));
      },
    },
  },
  state: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isIn: {
      options: [surveyStates],
      errorMessage: typeErrorMessage('in.options', { options: surveyStates }),
    },
  },
  startDate: {
    in: ['body'],
    errorMessage: typeErrorMessage('date._'),
    isDate: true,
    isEmpty: { negated: true },
    toDate: true,
  },
  endDate: {
    in: ['body'],
    errorMessage: typeErrorMessage('date._'),
    isDate: true,
    isEmpty: { negated: true },
    toDate: true,
  },
  surveySchemeId: {
    in: ['body'],
    errorMessage: 'Enter valid survey scheme.',
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value): Promise<void> => {
        const scheme = await SurveyScheme.findOne({ where: { id: value } });
        if (!scheme) throw new Error('Enter valid survey scheme.');
      },
    },
  },
  localeId: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, meta): Promise<void> => {
        const locale = await SystemLocale.findOne({ where: { id: value } });
        if (!locale) throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
  },
  allowGenUsers: {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
  },
  genUserKey: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    optional: { options: { nullable: true } },
  },
  authUrlDomainOverride: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    optional: { options: { nullable: true } },
  },
  authUrlTokenCharset: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    optional: { options: { nullable: true } },
    custom: {
      options: async (value: string, meta): Promise<void> => {
        if (value.split('').length !== [...new Set(value.split(''))].length)
          throw new Error(customTypeErrorMessage('string.unique', meta));
      },
    },
  },
  authUrlTokenLength: {
    in: ['body'],
    errorMessage: typeErrorMessage('int.min', { min: 8 }),
    isInt: { options: { min: 8 } },
    toInt: true,
    optional: { options: { nullable: true } },
  },
  suspensionReason: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    optional: { options: { nullable: true } },
  },
  /* surveyMonkeyUrl: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    optional: { options: { nullable: true } },
  }, */
  supportEmail: {
    in: ['body'],
    errorMessage: typeErrorMessage('email._'),
    isEmail: true,
    isEmpty: { negated: true },
    toLowerCase: true,
  },
  /* originatingUrl: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    optional: { options: { nullable: true } },
  }, */
  feedbackSchemeId: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    optional: { options: { nullable: true } },
    custom: {
      options: async (value, meta): Promise<void> => {
        const feedbackScheme = await FeedbackScheme.findOne({ where: { id: value } });
        if (!feedbackScheme) throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
  },
  submissionNotificationUrl: {
    in: ['body'],
    errorMessage: typeErrorMessage('url._'),
    isURL: { options: { require_tld: false } },
    optional: { options: { nullable: true } },
  },
  storeUserSessionOnServer: {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
  },
  numberOfSubmissionsForFeedback: {
    errorMessage: typeErrorMessage('int._'),
    isInt: true,
    toInt: true,
    optional: true,
  },
  maximumDailySubmissions: {
    errorMessage: typeErrorMessage('int._'),
    isInt: true,
    toInt: true,
    optional: true,
  },
  maximumTotalSubmissions: {
    errorMessage: typeErrorMessage('int._'),
    isInt: true,
    toInt: true,
    optional: { options: { nullable: true } },
  },
  minimumSubmissionInterval: {
    errorMessage: typeErrorMessage('int._'),
    isInt: true,
    toInt: true,
    optional: true,
  },
  searchSortingAlgorithm: {
    errorMessage: typeErrorMessage('in.options', { options: searchSortingAlgorithms }),
    isIn: { options: [searchSortingAlgorithms] },
    optional: true,
  },
  searchMatchScoreWeight: {
    errorMessage: typeErrorMessage('int.minMax', { min: 0, max: 100 }),
    isInt: { options: { min: 0, max: 100 } },
    toInt: true,
    optional: true,
  },
  userPersonalIdentifiers: {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: true,
  },
  userCustomFields: {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: true,
  },
};

export const surveySchemeOverrides: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('structure._'),
  custom: {
    options: async (value): Promise<void> => {
      if (
        typeof value !== 'object' ||
        Object.keys(value).some((key) => !['meals', 'questions'].includes(key))
      )
        throw new Error();

      // Meals
      try {
        validateMeals(value.meals);
      } catch (err: any) {
        throw new Error(err.message.split('\n')[0]);
      }

      // Questions
      if (
        !Array.isArray(value.questions) ||
        value.questions.some((item: any) => !isPlainObject(item))
      )
        throw new Error();
    },
  },
};
