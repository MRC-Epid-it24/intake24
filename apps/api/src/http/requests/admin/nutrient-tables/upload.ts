import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

import { csvFile } from '../generic';

const typeOptions = ['NutrientTableDataImport', 'NutrientTableIMappingImport'];

export default validate(
  checkSchema({
    type: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
      isIn: {
        options: [typeOptions],
        errorMessage: typeErrorMessage('in.options', { options: typeOptions }),
      },
    },
    file: csvFile,
  })
);
