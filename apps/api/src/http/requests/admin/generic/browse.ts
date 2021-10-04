import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';
import { paginate } from './defaults';

export default validate(checkSchema(paginate));
