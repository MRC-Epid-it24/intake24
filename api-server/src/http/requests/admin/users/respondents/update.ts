import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import { identifiers } from '../defaults';

export default validate(checkSchema(identifiers));
