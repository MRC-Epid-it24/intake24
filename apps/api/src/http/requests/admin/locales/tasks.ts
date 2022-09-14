import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';
import { pickJobParams } from '@intake24/common/types';

const jobOptions = ['PairwiseSearchCopyAssociations'];

export default validate(
  checkSchema({
    job: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isIn: {
        options: [jobOptions],
        bail: true,
        errorMessage: typeErrorMessage('in.options', { options: jobOptions }),
      },
    },
    params: {
      in: ['body'],
      errorMessage: 'Invalid job type parameters.',
      custom: {
        options: async (value, { req }): Promise<void> => {
          switch (req.body.job) {
            case 'PairwiseSearchCopyAssociations':
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
