import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';
import { paginate } from '@api/http/requests/admin/generic';
import { jobExists } from '@api/http/rules';

export default validate(
  checkSchema({
    ...paginate,
    type: {
      in: ['query'],
      optional: { options: { nullable: true } },
      custom: {
        options: async (value): Promise<void> => {
          if (typeof value === 'string' && jobExists(value)) return Promise.resolve();

          if (Array.isArray(value) && value.every((item) => jobExists(item)))
            return Promise.resolve();

          throw new Error(`Invalid job type`);
        },
      },
    },
  })
);
