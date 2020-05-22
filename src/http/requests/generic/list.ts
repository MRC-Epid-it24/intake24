import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';

export default validate(
  checkSchema({
    page: {
      in: ['query'],
      isInt: true,
      toInt: true,
      optional: { options: { nullable: true } },
    },
    limit: {
      in: ['query'],
      isInt: {
        options: {
          min: 1,
          max: 1000,
        },
      },
      toInt: true,
      optional: { options: { nullable: true } },
    },
    sort: {
      in: ['query'],
      isString: true,
      optional: { options: { nullable: true } },
      escape: true,
    },
    search: {
      in: ['query'],
      isString: true,
      optional: { options: { nullable: true } },
      escape: true,
    },
  })
);
