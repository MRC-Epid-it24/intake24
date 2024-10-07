import 'vuetify/styles';

import { createVuetify } from 'vuetify';
import * as directives from 'vuetify/directives';
import { aliases, fa } from 'vuetify/iconsets/fa';
import { VTimePicker } from 'vuetify/labs/VTimePicker';

import { colors } from '@intake24/common/theme';

export default createVuetify({
  components: {
    VTimePicker,
  },
  directives,
  defaults: {
    VBtn: {
      variant: 'flat',
    },
    VCardActions: {
      VBtn: {
        variant: 'flat',
      },
    },
    VCombobox: {
      variant: 'outlined',
    },
    VExpansionPanels: {
      eager: true,
    },
    VFileInput: {
      variant: 'outlined',
    },
    VSelect: {
      variant: 'outlined',
    },
    VSwitch: {
      color: 'primary',
    },
    VTextField: {
      variant: 'outlined',
    },
    VTextarea: {
      variant: 'outlined',
    },
  },
  display: {
    mobileBreakpoint: 'md',
  },
  icons: {
    defaultSet: 'fa',
    aliases: {
      ...aliases,
      add: 'fas fa-circle-plus',
      back: 'fas fa-arrow-left',
      cancel: 'fas fa-xmark',
      category: 'far fa-folder',
      close: 'fas fa-xmark',
      check: 'fas fa-circle-check',
      create: 'fas fa-plus',
      dashboard: 'fas fa-tachometer-alt',
      decrement: 'fas fa-minus',
      delete: 'fas fa-trash',
      download: 'fas fa-download',
      drink: 'fas fa-glass-water',
      edit: 'fas fa-edit',
      expandImage: 'fas fa-arrows-alt',
      feedback: 'fas fa-comments',
      food: 'fas fa-bowl-food',
      forward: 'fas fa-caret-right',
      info: 'fas fa-circle-info',
      home: 'fas fa-home',
      increment: 'fas fa-plus',
      login: 'fas fa-sign-in-alt',
      logout: 'fas fa-sign-out-alt',
      meal: 'fas fa-utensils',
      mealTime: 'fas fa-stopwatch',
      next: 'fas fa-angles-right',
      no: 'far fa-circle-xmark',
      ok: 'fas fa-check',
      options: 'fas fa-ellipsis-vertical',
      pause: 'fas fa-pause',
      profile: 'fas fa-user-circle',
      question: 'far fa-question-circle',
      redirect: 'fas fa-up-right-from-square',
      save: 'fas fa-save',
      search: 'fas fa-magnifying-glass',
      show: 'far fa-file',
      start: 'fas fa-play',
      survey: 'fas fa-poll-h',
      yes: 'far fa-circle-check',
    },
    sets: {
      fa,
    },
  },
  theme: {
    themes: {
      light: {
        colors,
      },
    },
  },
});
