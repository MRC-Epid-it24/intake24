import type { ParamSchema } from 'express-validator';

import { typeErrorMessage } from '@intake24/api/http/requests/util';
import { recordVisibilities } from '@intake24/common/security';

export const visibility: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('in.options', { options: recordVisibilities }),
  isString: true,
  isIn: { options: [recordVisibilities] },
  optional: true,
};
