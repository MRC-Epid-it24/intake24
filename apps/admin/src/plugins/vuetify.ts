import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa',
    values: {
      back: 'fas fa-level-up-alt',
      dashboard: 'fas fa-tachometer-alt',
      login: 'fas fa-sign-in-alt',
      logout: 'fas fa-sign-out-alt',
      user: 'fas fa-user-circle',
      add: 'fas fa-plus',
      create: 'fas fa-plus',
      delete: 'fas fa-trash',
      edit: 'fas fa-edit',
      read: 'far fa-file',
      save: 'fas fa-save',
      description: 'fas fa-note-sticky',
      // Resource icons
      languages: 'fas fa-language',
      locales: 'fas fa-map-marked-alt',
      'as-served-sets': 'fas fa-utensils',
      'guide-images': 'fas fa-crosshairs',
      'image-maps': 'fas fa-draw-polygon',
      'drinkware-sets': 'fas fa-mug-saucer',
      'nutrient-tables': 'fas fa-table-cells',
      'nutrient-types': 'fas fa-seedling',
      'nutrient-units': 'fas fa-calculator',
      'standard-units': 'fa-cubes-stacked',
    },
  },
  theme: {
    themes: {
      light: {
        primary: colors.blueGrey.darken4,
        secondary: colors.orange.darken3,
        accent: colors.deepOrange,
        info: colors.blue.darken3,
      },
    },
  },
});
