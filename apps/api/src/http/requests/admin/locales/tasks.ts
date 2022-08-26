import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';
import { pickJobParams } from '@intake24/common/types';

export default validate(
  checkSchema({
    job: {
      in: ['body'],
      errorMessage: 'Invalid job type.',
      isString: true,
      isIn: { options: [['LocaleCopyPairwiseAssociations']], bail: true },
    },
    params: {
      in: ['body'],
      errorMessage: 'Invalid job type parameters.',
      custom: {
        options: async (value, { req }): Promise<void> => {
          switch (req.body.job) {
            case 'LocaleCopyPairwiseAssociations':
              if (
                typeof value?.sourceLocaleId !== 'string' ||
                typeof value?.targetLocaleId !== 'string'
              )
                throw new Error();
              break;
            default:
              throw new Error();
          }
        },
        bail: true,
      },
      customSanitizer: {
        options: (value, { req }) => pickJobParams(value, req.body.job),
      },
    },
  })
);
