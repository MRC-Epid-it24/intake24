import browse from './browse.vue';
import dataExport from './data-export';
import form from './form.vue';
import prompts from './prompts';
import read from './read.vue';
import securables from './securables';

export default {
  browse,
  create: form,
  read,
  edit: form,
  prompts,
  'data-export': dataExport,
  securables,
};
