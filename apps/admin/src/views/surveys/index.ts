import browse from './browse.vue';
import form from './form.vue';
import read from './read.vue';
import dataExport from './data-export';
import mgmt from './mgmt';
import overrides from './overrides';
import respondents from './respondents';
import submissions from './submissions';

export default {
  browse,
  create: form,
  read,
  edit: form,
  'data-export': dataExport,
  mgmt,
  overrides,
  respondents,
  submissions,
};
