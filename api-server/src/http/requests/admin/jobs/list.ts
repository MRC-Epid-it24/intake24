import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import { paginate } from '@/http/requests/generic/defaults';

export default validate(
  checkSchema({
    ...paginate,
    type: {
      in: ['query'],
      optional: { options: { nullable: true } },
      custom: {
        options: async (value): Promise<void> => {
          if (typeof value !== 'string' && !Array.isArray(value))
            throw new Error(`Invalid job type`);

          if (Array.isArray(value) && value.some((item) => typeof item !== 'string'))
            throw new Error(`Invalid job type`);

          return Promise.resolve();
        },
      },
    },
  })
);
