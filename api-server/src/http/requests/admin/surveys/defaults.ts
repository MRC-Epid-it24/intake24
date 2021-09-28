import { Request } from 'express';
import { Schema } from 'express-validator';
import { isPlainObject } from 'lodash';
import { Op, WhereOptions } from 'sequelize';
import { SurveyState } from '@common/types/models';
import { validateMeals } from '@common/validators';
import { Locale, Scheme, Survey } from '@/db/models/system';
import { unique } from '@/http/rules';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Name must be filled in.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { surveyId } = (req as Request).params;
        const except: WhereOptions = surveyId ? { id: { [Op.ne]: surveyId } } : {};

        return unique({ model: Survey, condition: { field: 'name', value }, except });
      },
    },
  },
  state: {
    in: ['body'],
    errorMessage: 'Enter valid survey state.',
    isInt: true,
    toInt: true,
    custom: {
      options: async (value): Promise<void> => {
        return Object.values(SurveyState).includes(value)
          ? Promise.resolve()
          : Promise.reject(new Error('Enter valid survey state.'));
      },
    },
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
  schemeId: {
    in: ['body'],
    errorMessage: 'Enter valid survey scheme.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value): Promise<void> => {
        const scheme = await Scheme.findOne({ where: { id: value } });

        return scheme ? Promise.resolve() : Promise.reject(new Error('Enter valid scheme.'));
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
        const locale = await Locale.findOne({ where: { id: value } });

        return locale ? Promise.resolve() : Promise.reject(new Error('Enter valid locale.'));
      },
    },
  },
  allowGenUsers: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: true,
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
  surveyMonkeyUrl: {
    in: ['body'],
    errorMessage: 'URL must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
  supportEmail: {
    in: ['body'],
    errorMessage: 'Enter valid email address.',
    isEmail: true,
    isEmpty: { negated: true },
    toLowerCase: true,
  },
  originatingUrl: {
    in: ['body'],
    errorMessage: 'URL must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
  description: {
    in: ['body'],
    errorMessage: 'Description must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
  feedbackEnabled: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: true,
  },
  // feedbackStyle: {},
  submissionNotificationUrl: {
    in: ['body'],
    errorMessage: 'Submission notification URL must be valid URL',
    isURL: { options: { require_tld: false } },
    optional: { options: { nullable: true } },
  },
  storeUserSessionOnServer: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: true,
  },
  numberOfSubmissionsForFeedback: {
    errorMessage: 'Value has to be a number.',
    isInt: true,
    toInt: true,
  },
  finalPageHtml: {
    in: ['body'],
    errorMessage: 'Final page html must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
  maximumDailySubmissions: {
    errorMessage: 'Value has to be a number.',
    isInt: true,
    toInt: true,
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
  },
  overrides: {
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

        Promise.resolve();
      },
    },
  },
};

export default defaults;
