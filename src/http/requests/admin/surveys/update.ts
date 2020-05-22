import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import defaults from './defaults';

export default validate(checkSchema(defaults));
