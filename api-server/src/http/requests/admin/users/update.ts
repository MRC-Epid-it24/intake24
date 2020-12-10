import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import { identifiers, user } from './defaults';

export default validate(checkSchema({ ...identifiers, ...user }));
