import browse from './browse.vue';
import form from './form.vue';
import read from './read.vue';
import cards from './cards';
import topFoods from './top-foods';
import demographicGroups from './demographic-groups';
import henryCoefficients from './henry-coefficients';

export default {
  browse,
  create: form,
  read,
  edit: form,
  cards,
  'top-foods': topFoods,
  'demographic-groups': demographicGroups,
  'henry-coefficients': henryCoefficients,
};
