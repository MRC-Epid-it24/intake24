import { Schema } from 'express-validator';
import { SurveyState } from '@/db/models/system/survey';
import { Locale, Scheme } from '@/db/models/system';

export default {
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
        const schemes = await Scheme.findAll({ attributes: ['id'] });
        const match = schemes.find((scheme) => value === scheme.id);

        return match ? Promise.resolve() : Promise.reject(new Error('Enter valid scheme.'));
      },
    },
  },
  locale: {
    in: ['body'],
    errorMessage: 'Enter valid locale.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value): Promise<void> => {
        const locales = await Locale.findAll({ attributes: ['id'] });
        const match = locales.find((locale) => value === locale.id);

        return match ? Promise.resolve() : Promise.reject(new Error('Enter valid locale.'));
      },
    },
  },
  allowGenUsers: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: true,
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
    errorMessage: 'URL must be a string.',
    isString: true,
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
} as Schema;
