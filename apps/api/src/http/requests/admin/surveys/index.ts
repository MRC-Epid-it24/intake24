import { browse, entry } from '@intake24/api/http/requests/admin/generic';

import patch from './patch';
import put from './put';
import respondents from './respondents';
import store from './store';
import tasks from './tasks';

export default { browse, entry, store, patch, put, respondents, tasks };
