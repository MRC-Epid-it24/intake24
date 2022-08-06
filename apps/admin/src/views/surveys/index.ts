import browse from './browse.vue';
import dataExport from './data-export';
import form from './form.vue';
import overrides from './overrides';
import read from './read.vue';
import respondents from './respondents';
import securables from './securables';
import submissions from './submissions';

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
