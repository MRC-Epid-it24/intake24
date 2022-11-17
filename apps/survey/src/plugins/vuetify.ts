import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa',
    values: {
      add: 'fas fa-plus',
      back: 'fas fa-arrow-left',
      check: 'fas fa-check',
      create: 'fas fa-plus',
      dashboard: 'fas fa-tachometer-alt',
      delete: 'fas fa-trash',
      edit: 'fas fa-edit',
      expandImage: 'fas fa-arrows-alt',
      feedback: 'fas fa-comments',
      food: 'fas fa-cheese',
      forward: 'fas fa-caret-right',
      home: 'fas fa-home',
      login: 'fas fa-sign-in-alt',
      logout: 'fas fa-sign-out-alt',
      meal: 'fas fa-utensils',
      next: 'fas fa-angles-right',
      no: 'far fa-circle-xmark',
      options: 'fas fa-ellipsis-vertical',
      profile: 'fas fa-user-circle',
      question: 'far fa-question-circle',
      save: 'fas fa-save',
      show: 'far fa-file',
      start: 'fas fa-play',
      survey: 'fas fa-poll-h',
      yes: 'far fa-circle-check',
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
