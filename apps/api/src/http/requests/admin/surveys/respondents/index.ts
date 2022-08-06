import { browse, entry } from '@intake24/api/http/requests/admin/generic';

import emailFeedback from './email-feedback';
import store from './store';
import update from './update';
import upload from './upload';

export default { browse, entry, store, update, upload, emailFeedback };
