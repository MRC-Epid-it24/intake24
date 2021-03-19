import detail from './Detail.vue';
import form from './Form.vue';
import list from './List.vue';
import dataExport from './DataExport.vue';
import mgmt from './Mgmt.vue';
import respondents from './respondents/Respondents.vue';
import submissions from './Submissions.vue';

export default {
  detail,
  create: form,
  edit: form,
  list,
  'data-export': dataExport,
  mgmt,
  respondents,
  submissions,
};
