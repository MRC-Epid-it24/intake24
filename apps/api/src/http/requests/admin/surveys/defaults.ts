import type { Request } from 'express';
import type { ParamSchema, Schema } from 'express-validator';
import { isPlainObject } from 'lodash';
import ms from 'ms';
import { ZodError } from 'zod';

import type { SurveyAttributes, WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import {
  searchSortingAlgorithms,
  spellingCorrectionPreferenceOptions,
  surveyStates,
} from '@intake24/common/surveys';
import { notification } from '@intake24/common/types';
import { validateMeals } from '@intake24/common/validators';
import { FeedbackScheme, Op, Survey, SurveyScheme, SystemLocale } from '@intake24/db';

export const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 512 }),
    isString: { bail: true },
    isLength: { bail: true, options: { max: 512 } },
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
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { surveyId } = (meta.req as Request).params;

        const survey = await Survey.findByPk(surveyId, { attributes: ['id', 'surveySchemeId'] });
        if (survey?.surveySchemeId === value)
          return;

        try {
          await (meta.req as Request).scope.cradle.aclService.findAndCheckVisibility(
            SurveyScheme,
            'use',
            { attributes: ['id', 'ownerId', 'visibility'], where: { id: value } },
          );
        }
        catch (err) {
          throw new Error('$restricted');
        }
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
        const { surveyId } = (meta.req as Request).params;

        const survey = await Survey.findByPk(surveyId, { attributes: ['id', 'localeId'] });
        if (survey?.localeId === value)
          return;

        try {
          await (meta.req as Request).scope.cradle.aclService.findAndCheckVisibility(
            SystemLocale,
            'use',
            { attributes: ['id', 'ownerId', 'visibility'], where: { id: value } },
          );
        }
        catch (err) {
          throw new Error('$restricted');
        }
      },
    },
  },
  allowGenUsers: {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
  },
  authCaptcha: {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: true,
  },
  genUserKey: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    optional: { options: { nullable: true } },
  },
  authUrlDomainOverride: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 512 }),
    isString: true,
    isLength: { bail: true, options: { max: 512 } },
    optional: { options: { nullable: true } },
  },
  authUrlTokenCharset: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 128 }),
    isString: { bail: true },
    isLength: { bail: true, options: { max: 128 } },
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
    errorMessage: typeErrorMessage('int.minMax', { min: 8, max: 128 }),
    isInt: { options: { min: 8, max: 128 } },
    toInt: true,
    optional: { options: { nullable: true } },
  },
  suspensionReason: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 512 }),
    isString: true,
    isLength: { bail: true, options: { max: 512 } },
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
    isLength: {
      bail: true,
      options: { max: 512 },
      errorMessage: typeErrorMessage('string.max', { max: 512 }),
    },
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
        const { surveyId } = (meta.req as Request).params;

        const survey = await Survey.findByPk(surveyId, { attributes: ['id', 'feedbackSchemeId'] });
        if (survey?.feedbackSchemeId === value)
          return;

        try {
          await (meta.req as Request).scope.cradle.aclService.findAndCheckVisibility(
            FeedbackScheme,
            'use',
            { attributes: ['id', 'ownerId', 'visibility'], where: { id: value } },
          );
        }
        catch (err) {
          throw new Error('$restricted');
        }
      },
    },
  },
  notifications: {
    in: ['body'],
    errorMessage: typeErrorMessage('structure._'),
    custom: {
      options: (value): boolean => {
        try {
          notification.array().parse(value);
          return true;
        }
        catch (err) {
          if (err instanceof ZodError)
            throw err.errors.at(0)?.message;

          throw err;
        }
      },
    },
  },
  sessionLifetime: {
    in: ['body'],
    errorMessage: typeErrorMessage('date.ms'),
    optional: true,
    custom: {
      options: value => !!ms(value),
    },
    customSanitizer: {
      options: value => (Number.isNaN(Number(value)) ? value : ms(Number(value))),
    },
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
  'searchSettings.collectData': {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: true,
  },
  'searchSettings.maxResults': {
    in: ['body'],
    errorMessage: typeErrorMessage('int.minMax', { min: 10, max: 100 }),
    isInt: { options: { min: 10, max: 100 } },
    toInt: true,
    optional: true,
  },
  'searchSettings.sortingAlgorithm': {
    in: ['body'],
    errorMessage: typeErrorMessage('in.options', { options: searchSortingAlgorithms }),
    isIn: { options: [searchSortingAlgorithms] },
    optional: true,
  },
  'searchSettings.matchScoreWeight': {
    in: ['body'],
    errorMessage: typeErrorMessage('int.minMax', { min: 0, max: 100 }),
    isInt: { options: { min: 0, max: 100 } },
    toInt: true,
    optional: true,
  },
  'searchSettings.minWordLength1': {
    in: ['body'],
    errorMessage: typeErrorMessage('int.minMax', { min: 2, max: 10 }),
    isInt: { options: { min: 2, max: 10 } },
    toInt: true,
    optional: true,
  },
  'searchSettings.minWordLength2': {
    in: ['body'],
    errorMessage: typeErrorMessage('int.minMax', { min: 3, max: 10 }),
    isInt: { options: { min: 3, max: 10 } },
    toInt: true,
    optional: true,
  },
  'searchSettings.spellingCorrectionPreference': {
    in: ['body'],
    errorMessage: typeErrorMessage('in.options', { options: spellingCorrectionPreferenceOptions }),
    isIn: { options: [spellingCorrectionPreferenceOptions] },
    optional: true,
  },
  'searchSettings.enableEditDistance': {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: true,
  },
  'searchSettings.enablePhonetic': {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: true,
  },
  'searchSettings.minWordLengthPhonetic': {
    in: ['body'],
    errorMessage: typeErrorMessage('int.minMax', { min: 2, max: 10 }),
    isInt: { options: { min: 2, max: 10 } },
    toInt: true,
    optional: true,
  },
  'searchSettings.firstWordCost': {
    in: ['body'],
    errorMessage: typeErrorMessage('int.minMax', { min: 0, max: 20 }),
    isInt: { options: { min: 0, max: 20 } },
    toInt: true,
    optional: true,
  },
  'searchSettings.wordOrderCost': {
    in: ['body'],
    errorMessage: typeErrorMessage('int.minMax', { min: 0, max: 10 }),
    isInt: { options: { min: 0, max: 10 } },
    toInt: true,
    optional: true,
  },
  'searchSettings.wordDistanceCost': {
    in: ['body'],
    errorMessage: typeErrorMessage('int.minMax', { min: 0, max: 10 }),
    isInt: { options: { min: 0, max: 10 } },
    toInt: true,
    optional: true,
  },
  'searchSettings.unmatchedWordCost': {
    in: ['body'],
    errorMessage: typeErrorMessage('int.minMax', { min: 0, max: 10 }),
    isInt: { options: { min: 0, max: 10 } },
    toInt: true,
    optional: true,
  },
  'searchSettings.enableRelevantCategories': {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: true,
  },
  'searchSettings.relevantCategoryDepth': {
    in: ['body'],
    errorMessage: typeErrorMessage('int.minMax', { min: 0, max: 5 }),
    isInt: { options: { min: 0, max: 5 } },
    toInt: true,
    optional: true,
  },
};

export const userPersonalData: Schema = {
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
        typeof value !== 'object'
        || Object.keys(value).some(key => !['meals', 'prompts'].includes(key))
      )
        throw new Error('Invalid survey scheme overrides structure');

      // Meals
      try {
        validateMeals(value.meals);
      }
      catch (err: any) {
        throw new Error(err.message.split('\n')[0]);
      }

      // Prompts
      if (!Array.isArray(value.prompts) || value.prompts.some((item: any) => !isPlainObject(item)))
        throw new Error('Invalid survey scheme prompts structure');
    },
  },
};
