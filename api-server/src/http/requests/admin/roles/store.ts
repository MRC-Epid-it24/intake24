import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import { permissions } from '@/http/requests/admin/acl';
import defaults from './defaults';

export default validate(checkSchema({ ...defaults, permissions }));
