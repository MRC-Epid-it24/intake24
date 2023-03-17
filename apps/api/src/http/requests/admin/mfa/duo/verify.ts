import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { challengeId, name, token } from '../defaults';

export default validate(checkSchema({ challengeId, name, token }));
