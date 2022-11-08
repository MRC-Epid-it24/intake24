import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa',
    values: {
      back: 'fas fa-arrow-left',
      check: 'fas fa-check',
      create: 'fas fa-plus',
      dashboard: 'fas fa-tachometer-alt',
      delete: 'fas fa-trash',
      edit: 'fas fa-edit',
      expandImage: 'fa-arrows-alt',
      feedback: 'fas fa-comments',
      food: 'fas fa-cheese',
      forward: 'fas fa-caret-right',
      home: 'fas fa-home',
      login: 'fas fa-sign-in-alt',
      logout: 'fas fa-sign-out-alt',
      meal: 'fas fa-utensils',
      next: 'fa-angle-right',
      plus: 'fa-plus',
      profile: 'fas fa-user-circle',
      question: 'far fa-question-circle',
      save: 'fas fa-save',
      show: 'far fa-file',
      survey: 'fas fa-poll-h',
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
