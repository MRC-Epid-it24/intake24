// import type { Icons } from 'vuetify';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

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
      check: 'fas fa-check-circle',
      close: 'fas fa-circle-xmark',
      create: 'fas fa-plus',
      back: 'fas fa-level-up-alt',
      dashboard: 'fas fa-tachometer-alt',
      delete: 'fas fa-trash',
      description: 'fas fa-note-sticky',
      download: 'fas fa-download',
      edit: 'fas fa-edit',
      handle: 'fas fa-grip-vertical',
      login: 'fas fa-sign-in-alt',
      logout: 'fas fa-sign-out-alt',
      options: 'fas fa-ellipsis-vertical',
      read: 'far fa-file',
      search: 'fas fa-magnifying-glass',
      save: 'fas fa-save',
      sync: 'fas fa-sync',
      times: 'fas fa-times-circle',
      upload: 'fas fa-upload',
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
        primary: '#EE672D',
        secondary: '#020202',
        ternary: '#FEE8E1',
        quaternary: '#d34980',
        info: '#4456a6',
        accent: '#f68623',
        // #77c044
        // #B968DC
        // #41C3EC
        // #FFDB59
      },
    },
  },
});
