import Vue from 'vue';
import Vuetify from 'vuetify/lib';

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
    },
  },
  theme: {
    themes: {
      light: {
        primary: '#263238',
        secondary: '#FF3D00',
      },
    },
  },
});
