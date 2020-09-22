import { Schema } from 'express-validator';
import { isPlainObject, has } from 'lodash';
import { SchemeTypes } from '@common/types/models/system';

export default {
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
      options: async (value): Promise<void> => {
        if (!isPlainObject(value) || Object.keys(value).some((item) => !Array.isArray(item)))
          throw new Error('Enter valid scheme questions.');

        Promise.resolve();
      },
    },
  },
  meals: {
    in: ['body'],
    errorMessage: 'Enter valid meal list.',
    custom: {
      options: async (value): Promise<void> => {
        if (
          !Array.isArray(value) ||
          value.some((item) => !isPlainObject(item) || !has(item, ['a', 'b']))
        )
          throw new Error('Enter valid meal list.');

        Promise.resolve();
      },
    },
  },
} as Schema;
