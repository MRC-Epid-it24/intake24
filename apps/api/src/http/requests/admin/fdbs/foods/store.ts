import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import defaults from './defaults';
import { attributes, categories, nutrients } from '../common';

export default validate(checkSchema({ ...defaults, ...attributes, ...categories, ...nutrients }));
