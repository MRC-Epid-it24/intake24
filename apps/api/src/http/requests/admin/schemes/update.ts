import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';
import { defaults, name } from './defaults';

export default validate(checkSchema({ ...defaults, name }));
