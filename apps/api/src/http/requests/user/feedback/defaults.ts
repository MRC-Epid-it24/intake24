import type { Schema } from 'express-validator';

const defaults: Schema = {
  survey: {
    in: ['query'],
    errorMessage: 'Missing survey parameter.',
    isString: true,
  },
  submissions: {
    in: ['query'],
    errorMessage: 'Invalid submissions parameter.',
    optional: true,
    custom: {
      options: async (value): Promise<void> => {
        if (!Array.isArray(value) || value.some((item) => !item || typeof item !== 'string'))
          throw new Error('Submissions parameter must be array of strings');
      },
    },
  },
};

export default defaults;
