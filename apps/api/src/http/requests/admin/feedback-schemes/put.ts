import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { visibility } from '../generic';
import { defaults, name } from './defaults';

export default validate(checkSchema({ ...defaults, name, visibility }));
