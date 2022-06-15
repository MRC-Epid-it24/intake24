import type { Request } from 'express';
import type { ParamSchema, Schema } from 'express-validator';
import { isPlainObject } from 'lodash';
import { Op, WhereOptions, SystemLocale, SurveyScheme, Survey, FeedbackScheme } from '@intake24/db';
import {
  searchSortingAlgorithms,
  SurveyAttributes,
  surveyStates,
} from '@intake24/common/types/models';
import { validateMeals } from '@intake24/common/validators';
import { unique } from '@intake24/api/http/rules';

export const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Name must be filled in.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { surveyId } = (req as Request).params;
        const where: WhereOptions<SurveyAttributes> = surveyId ? { id: { [Op.ne]: surveyId } } : {};

        return unique({ model: Survey, condition: { field: 'name', value }, options: { where } });
      },
    },
  },
  state: {
    in: ['body'],
    errorMessage: 'Enter valid survey state.',
    isString: true,
    isIn: { options: [surveyStates] },
  },
  startDate: {
    in: ['body'],
    errorMessage: 'Enter valid survey start date.',
    isDate: true,
    isEmpty: { negated: true },
    toDate: true,
  },
  endDate: {
    in: ['body'],
    errorMessage: 'Enter valid survey end date.',
    isDate: true,
    isEmpty: { negated: true },
    toDate: true,
  },
  surveySchemeId: {
    in: ['body'],
    errorMessage: 'Enter valid survey scheme.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value): Promise<void> => {
        const scheme = await SurveyScheme.findOne({ where: { id: value } });
        if (!scheme) throw new Error('Enter valid survey scheme.');
      },
    },
  },
  localeId: {
    in: ['body'],
    errorMessage: 'Enter valid locale.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value): Promise<void> => {
        const locale = await SystemLocale.findOne({ where: { id: value } });
        if (!locale) throw new Error('Enter valid locale.');
      },
    },
  },
  allowGenUsers: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: { options: { strict: true } },
  },
  genUserKey: {
    in: ['body'],
    errorMessage: 'JWT token/secret must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
  authUrlDomainOverride: {
    in: ['body'],
    errorMessage: 'Authentication URL domain must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
  authUrlTokenCharset: {
    in: ['body'],
    errorMessage: 'Authentication URL Token charset must be a string of unique characters.',
    isString: true,
    optional: { options: { nullable: true } },
    custom: {
      options: async (value: any): Promise<void> => {
        if (typeof value !== 'string') throw new Error('Charset must be a string.');

        if (value.split('').length !== [...new Set(value.split(''))].length)
          throw new Error('Charset must be a string of unique characters.');
      },
    },
  },
  authUrlTokenLength: {
    in: ['body'],
    errorMessage: 'Authentication URL Token length must be at least 8 or longer.',
    isInt: { options: { min: 8 } },
    toInt: true,
    optional: { options: { nullable: true } },
  },
  suspensionReason: {
    in: ['body'],
    errorMessage: 'Suspension reason must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
  /* surveyMonkeyUrl: {
    in: ['body'],
    errorMessage: 'URL must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  }, */
  supportEmail: {
    in: ['body'],
    errorMessage: 'Enter valid email address.',
    isEmail: true,
    isEmpty: { negated: true },
    toLowerCase: true,
  },
  /* originatingUrl: {
    in: ['body'],
    errorMessage: 'URL must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  }, */
  feedbackSchemeId: {
    in: ['body'],
    errorMessage: 'Enter valid feedback scheme.',
    isString: true,
    optional: { options: { nullable: true } },
    custom: {
      options: async (value): Promise<void> => {
        const feedbackScheme = await FeedbackScheme.findOne({ where: { id: value } });
        if (!feedbackScheme) throw new Error('Enter valid feedback scheme.');
      },
    },
  },
  submissionNotificationUrl: {
    in: ['body'],
    errorMessage: 'Submission notification URL must be valid URL',
    isURL: { options: { require_tld: false } },
    optional: { options: { nullable: true } },
  },
  storeUserSessionOnServer: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: { options: { strict: true } },
  },
  numberOfSubmissionsForFeedback: {
    errorMessage: 'Value has to be a number.',
    isInt: true,
    toInt: true,
    optional: true,
  },
  maximumDailySubmissions: {
    errorMessage: 'Value has to be a number.',
    isInt: true,
    toInt: true,
    optional: true,
  },
  maximumTotalSubmissions: {
    errorMessage: 'Value has to be a number.',
    isInt: true,
    toInt: true,
    optional: { options: { nullable: true } },
  },
  minimumSubmissionInterval: {
    errorMessage: 'Value has to be a number.',
    isInt: true,
    toInt: true,
    optional: true,
  },
  searchSortingAlgorithm: {
    errorMessage: 'Select valid search sorting algorithm.',
    isIn: { options: [searchSortingAlgorithms] },
    optional: true,
  },
  searchMatchScoreWeight: {
    errorMessage: 'Search match score weight has to be between 0-100.',
    isInt: { options: { min: 0, max: 100 } },
    toInt: true,
    optional: true,
  },
  userPersonalIdentifiers: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: { options: { strict: true } },
    optional: true,
  },
  userCustomFields: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: { options: { strict: true } },
    optional: true,
  },
};

export const surveySchemeOverrides: ParamSchema = {
  in: ['body'],
  errorMessage: 'Enter valid scheme overrides.',
  custom: {
    options: async (value): Promise<void> => {
      if (
        typeof value !== 'object' ||
        Object.keys(value).some((key) => !['meals', 'questions'].includes(key))
      )
        throw new Error('Invalid override object. Not and object or missing properties');

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
        throw new Error('Invalid questions. Should be array of PromptQuestions.');
    },
  },
};
