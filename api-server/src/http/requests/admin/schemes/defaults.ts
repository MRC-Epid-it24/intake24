import { Schema } from 'express-validator';
import { SchemeTypes } from '@/db/models/system/scheme';

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
    optional: { options: { nullable: true } },
  },
  meals: {
    in: ['body'],
    errorMessage: 'Enter valid scheme meals.',
    optional: { options: { nullable: true } },
  },
} as Schema;
