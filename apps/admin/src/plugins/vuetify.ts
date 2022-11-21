import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa',
    values: {
      add: 'fas fa-plus',
      cancel: 'fas fa-circle-xmark',
      close: 'fas fa-circle-xmark',
      create: 'fas fa-plus',
      back: 'fas fa-level-up-alt',
      dashboard: 'fas fa-tachometer-alt',
      delete: 'fas fa-trash',
      description: 'fas fa-note-sticky',
      edit: 'fas fa-edit',
      login: 'fas fa-sign-in-alt',
      logout: 'fas fa-sign-out-alt',
      options: 'fas fa-ellipsis-vertical',
      read: 'far fa-file',
      save: 'fas fa-save',
      user: 'fas fa-user-circle',
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
