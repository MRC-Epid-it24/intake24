import { browse, entry } from '@intake24/api/http/requests/admin/generic';

import store from './store';
import sync from './sync';
import update from './update';

export default { browse, entry, store, update, sync };
