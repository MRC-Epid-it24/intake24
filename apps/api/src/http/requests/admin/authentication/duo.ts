import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { userAgent } from '../../generic';
import { challengeId, provider, token } from '../mfa/defaults';

export default validate(checkSchema({ 'user-agent': userAgent, challengeId, provider, token }));
