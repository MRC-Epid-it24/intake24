import { browse, entry } from '@intake24/api/http/requests/admin/generic';
import store from './store';
import patch from './patch';
import put from './put';
import dataExport from './data-export';
import respondents from './respondents';

export default { browse, entry, store, patch, put, dataExport, respondents };
