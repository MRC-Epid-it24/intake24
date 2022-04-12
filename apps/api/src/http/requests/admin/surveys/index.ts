import { browse } from '@intake24/api/http/requests/admin/generic';
import store from './store';
import patch from './patch';
import put from './put';
import dataExport from './data-export';
import mgmt from './mgmt';
import respondents from './respondents';

export default { browse, store, patch, put, dataExport, mgmt, respondents };
