import type { Schema } from 'express-validator';

const defaults: Schema = {
  actions: {
    in: ['body'],
    custom: {
      options: async (value): Promise<void> => {
        // TODO: validate action per securable type
        if (
          !Array.isArray(value) ||
          !value.length ||
          value.some((action) => typeof action !== 'string')
        )
          throw new Error('Invalid securable action');
      },
    },
  },
};

export default defaults;
