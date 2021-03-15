import { Schema } from 'express-validator';
import { isPlainObject } from 'lodash';
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
      // TODO: tweak ajv JSON validator to work correctly with generic language object types & conditions
      /* options: (value): boolean => {
        validateRecallQuestions(value);
        return true;
      }, */
      options: async (value): Promise<void> => {
        if (
          !isPlainObject(value) ||
          Object.values(value).some((item) => !Array.isArray(item) && !isPlainObject(item))
        )
          throw new Error('Enter valid scheme questions.');

        Promise.resolve();
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
