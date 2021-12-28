import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';
import { attributes, categories } from '../common';
import defaults from './defaults';

export default validate(checkSchema({ ...defaults, ...attributes, ...categories }));
