import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { name } from '../defaults';

export default validate(checkSchema({ name }));
