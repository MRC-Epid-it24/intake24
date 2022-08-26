import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { identifiers, user } from './defaults';

export default validate(checkSchema({ ...identifiers, ...user }));
