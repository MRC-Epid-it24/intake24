import type { Schema } from 'express-validator';

const defaults: Schema = {
  description: {
    in: ['body'],
    errorMessage: 'Enter a description.',
    isString: true,
    isEmpty: { negated: true },
  },
};

export default defaults;
