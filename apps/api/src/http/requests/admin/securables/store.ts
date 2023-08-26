import { checkSchema } from 'express-validator';

import type { ValidationMiddleware } from '@intake24/api/http/requests/util';
import type { SecurableType } from '@intake24/common/security';
import { validate } from '@intake24/api/http/requests/util';

import { email, name, phoneOptional } from '../users/defaults';
import defaults from './defaults';

export default (securable: SecurableType): ValidationMiddleware[] =>
  validate(checkSchema({ name, email, phone: phoneOptional, ...defaults(securable) }));
