import { browse, entry } from '@intake24/api/http/requests/admin/generic';

import dataExport from './data-export';
import patch from './patch';
import put from './put';
import respondents from './respondents';
import store from './store';

export default { browse, entry, store, patch, put, dataExport, respondents };
