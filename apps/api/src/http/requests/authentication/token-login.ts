import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { userAgent } from '../generic';

export default validate(checkSchema({ 'user-agent': userAgent }));