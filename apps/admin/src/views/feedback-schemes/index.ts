import browse from './browse.vue';
import cards from './cards';
import demographicGroups from './demographic-groups';
import form from './form.vue';
import henryCoefficients from './henry-coefficients';
import read from './read.vue';
import securables from './securables';
import topFoods from './top-foods';

export default {
  browse,
  create: form,
  read,
  edit: form,
  cards,
  'top-foods': topFoods,
  'demographic-groups': demographicGroups,
  'henry-coefficients': henryCoefficients,
  securables,
};
