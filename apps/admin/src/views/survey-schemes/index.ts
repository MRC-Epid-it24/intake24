import browse from './browse.vue';
import form from './form.vue';
import read from './read.vue';
import questions from './questions';
import dataExport from './data-export';
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
