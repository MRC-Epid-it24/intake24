import browse from './browse.vue';
import dataExport from './data-export';
import form from './form.vue';
import questions from './questions';
import read from './read.vue';
import securables from './securables';

export default {
  browse,
  create: form,
  read,
  edit: form,
  questions,
  'data-export': dataExport,
  securables,
};
