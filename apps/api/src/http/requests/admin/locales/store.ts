import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { code, defaults } from './defaults';

export default validate(checkSchema({ ...defaults, code }));