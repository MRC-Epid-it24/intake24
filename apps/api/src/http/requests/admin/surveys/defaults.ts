import type { Request } from 'express';
import type { ParamSchema, Schema } from 'express-validator';
import { isPlainObject } from 'lodash';

import type { SurveyAttributes, WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { searchSortingAlgorithms, surveyStates } from '@intake24/common/surveys';
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
        if (survey?.surveySchemeId === value) return;

        try {
          await (meta.req as Request).scope.cradle.aclService.findAndCheckVisibility(
            SurveyScheme,
            'use',
            { attributes: ['id', 'ownerId', 'visibility'], where: { id: value } }
          );
        } catch (err) {
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
        if (survey?.localeId === value) return;

        try {
          await (meta.req as Request).scope.cradle.aclService.findAndCheckVisibility(
            SystemLocale,
            'use',
            { attributes: ['id', 'ownerId', 'visibility'], where: { id: value } }
          );
        } catch (err) {
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
        if (survey?.feedbackSchemeId === value) return;

        try {
          await (meta.req as Request).scope.cradle.aclService.findAndCheckVisibility(
            FeedbackScheme,
            'use',
            { attributes: ['id', 'ownerId', 'visibility'], where: { id: value } }
          );
        } catch (err) {
          throw new Error('$restricted');
        }
      },
    },
  },
  submissionNotificationUrl: {
    in: ['body'],
    errorMessage: typeErrorMessage('url._'),
    isLength: {
      bail: true,
      options: { max: 2048 },
      errorMessage: typeErrorMessage('string.max', { max: 2048 }),
    },
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
        typeof value !== 'object' ||
        Object.keys(value).some((key) => !['meals', 'prompts'].includes(key))
      )
        throw new Error();

      // Meals
      try {
        validateMeals(value.meals);
      } catch (err: any) {
        throw new Error(err.message.split('\n')[0]);
      }

      // Prompts
      if (!Array.isArray(value.prompts) || value.prompts.some((item: any) => !isPlainObject(item)))
        throw new Error();
    },
  },
};
