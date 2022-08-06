import { browse, entry } from '@intake24/api/http/requests/admin/generic';

import copy from './copy';
import patch from './patch';
import put from './put';
import store from './store';
import templates from './templates';

export default { browse, entry, store, patch, put, copy, templates };
