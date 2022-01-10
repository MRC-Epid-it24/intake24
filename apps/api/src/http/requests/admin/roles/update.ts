import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import { permissions } from '@intake24/api/http/requests/admin/acl';
import defaults from './defaults';

export default validate(checkSchema({ ...defaults, permissions }));
