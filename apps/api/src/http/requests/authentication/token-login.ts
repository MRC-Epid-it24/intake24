import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { authHeaders } from '../generic';

export default validate(checkSchema(authHeaders));
