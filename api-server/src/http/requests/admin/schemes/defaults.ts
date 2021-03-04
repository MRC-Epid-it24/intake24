import { Schema } from 'express-validator';
import { SchemeTypes } from '@common/types/models';
import { validateMeals, validateRecallQuestions, validateExportSections } from '@common/validators';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Scheme name must be a string.',
    isString: true,
  },
  type: {
    in: ['body'],
    errorMessage: 'Enter valid scheme type.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value): Promise<void> => {
        return Object.values(SchemeTypes).includes(value)
          ? Promise.resolve()
          : Promise.reject(new Error('Enter valid scheme type.'));
      },
    },
  },
  questions: {
    in: ['body'],
    errorMessage: 'Enter valid scheme questions.',
    custom: {
      options: (value): boolean => {
        validateRecallQuestions(value);
        return true;
      },
    },
  },
  meals: {
    in: ['body'],
    errorMessage: 'Enter valid meal list.',
    custom: {
      options: (value): boolean => {
        validateMeals(value);
        return true;
      },
    },
  },
  export: {
    in: ['body'],
    errorMessage: 'Enter valid data export field list.',
    custom: {
      options: (value): boolean => {
        validateExportSections(value);
        return true;
      },
    },
  },
};

export default defaults;
