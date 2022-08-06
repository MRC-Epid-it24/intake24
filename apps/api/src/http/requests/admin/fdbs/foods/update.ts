import { checkSchema } from 'express-validator';

import validate from '@intake24/api/http/requests/validate';

import { attributes, categories, nutrients } from '../common';
import defaults from './defaults';

export default validate(checkSchema({ ...defaults, ...attributes, ...categories, ...nutrients }));
