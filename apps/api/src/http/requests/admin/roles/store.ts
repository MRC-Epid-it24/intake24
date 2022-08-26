import { checkSchema } from 'express-validator';

import { permissions } from '@intake24/api/http/requests/admin/acl';
import { validate } from '@intake24/api/http/requests/util';

import defaults from './defaults';

export default validate(checkSchema({ ...defaults, permissions }));
