import Vue from 'vue';
import Vuetify from 'vuetify/lib';

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
      create: 'fas fa-plus',
      delete: 'fas fa-trash',
      edit: 'fas fa-edit',
      read: 'far fa-file',
      save: 'fas fa-save',
    },
  },
  theme: {
    themes: {
      light: {
        primary: '#263238',
        secondary: '#EF6C00',
      },
    },
  },
});
