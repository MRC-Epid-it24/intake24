import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';
import { permissions } from '@api/http/requests/admin/acl';
import defaults from './defaults';

export default validate(checkSchema({ ...defaults, permissions }));
