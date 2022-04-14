import browse from './browse.vue';
import form from './form.vue';
import read from './read.vue';
import dataExport from './data-export';
import overrides from './overrides';
import respondents from './respondents';
import submissions from './submissions';
import securables from './securables';

export default {
  browse,
  create: form,
  read,
  edit: form,
  'data-export': dataExport,
  overrides,
  respondents,
  submissions,
  securables,
};
