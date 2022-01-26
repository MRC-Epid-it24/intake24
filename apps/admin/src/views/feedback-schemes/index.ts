import browse from './browse.vue';
import form from './form.vue';
import read from './read.vue';
import foodGroups from './food-groups';
import topFoods from './top-foods';

export default {
  browse,
  create: form,
  read,
  edit: form,
  'food-groups': foodGroups,
  'top-foods': topFoods,
};
