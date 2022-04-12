import { browse, entry } from '@intake24/api/http/requests/admin/generic';
import store from './store';
import update from './update';
import upload from './upload';
import emailFeedback from './email-feedback';

export default { browse, entry, store, update, upload, emailFeedback };
