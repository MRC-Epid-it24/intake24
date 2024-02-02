import { browse } from '@intake24/api/http/requests/admin/generic';

import parseBaseImages from './parse-base-images';
import store from './store';
import update from './update';

export default { browse, store, update, parseBaseImages };
