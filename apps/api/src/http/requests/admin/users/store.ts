import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';
import { identifiers, password, user } from './defaults';

export default validate(
  checkSchema({
    ...identifiers,
    ...password,
    ...user,
  })
);
