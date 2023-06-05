// import type { Icons } from 'vuetify';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

import type { Dictionary } from '@intake24/common/types';

import resources from '../router/resources';

const resourceIcons = resources.reduce<Dictionary>((acc, resource) => {
  return (acc[resource.name] = resource.icon), acc;
}, {});

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
      search: 'fas fa-magnifying-glass',
      save: 'fas fa-save',
      user: 'fas fa-user-circle',
      // MFA Provider icons
      duo: 'fas fa-mobile-screen-button',
      fido: 'fas fa-microchip',
      otp: 'fas fa-stopwatch',
      // Resource icons
      ...resourceIcons,
      categories: 'fas fa-list',
      foods: 'fas fa-drumstick-bite',
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
