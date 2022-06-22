import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa',
    values: {
      back: 'fas fa-arrow-left',
      dashboard: 'fas fa-tachometer-alt',
      login: 'fas fa-sign-in-alt',
      logout: 'fas fa-sign-out-alt',
      profile: 'fas fa-user-circle',
      create: 'fas fa-plus',
      delete: 'fas fa-trash',
      edit: 'fas fa-edit',
      show: 'far fa-file',
      save: 'fas fa-save',
      meal: 'fas fa-utensils',
      food: 'fas fa-cheese',
      survey: 'fas fa-poll-h',
      forward: 'fas fa-caret-right',
      question: 'far fa-question-circle',
      check: 'fas fa-check',
      next: 'fa-angle-right',
      plus: 'fa-plus',
    },
  },
  theme: {
    themes: {
      light: {
        primary: colors.blueGrey.darken4,
        secondary: colors.orange.darken3,
        accent: colors.deepOrange,
      },
    },
  },
});
