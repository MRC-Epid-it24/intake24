import browse from './browse.vue';
import form from './form.vue';
import read from './read.vue';
import questions from './questions';
import dataExport from './data-export';

export default {
  browse,
  create: form,
  read,
  edit: form,
  questions,
  'data-export': dataExport,
};
