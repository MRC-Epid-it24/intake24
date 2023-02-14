import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { userAgent } from '../../generic';
import { challengeId, otpToken, provider } from '../mfa/defaults';

export default validate(
  checkSchema({ 'user-agent': userAgent, challengeId, provider, token: otpToken })
);
