import browse from './browse.vue';
import form from './form.vue';
import read from './read.vue';
import splitLists from './split-lists';
import splitWords from './split-words';
import synonymSets from './synonym-sets';

export default {
  browse,
  create: form,
  read,
  edit: form,
  'split-lists': splitLists,
  'split-words': splitWords,
  'synonym-sets': synonymSets,
};
