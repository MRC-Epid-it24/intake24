<template>
  <v-card class="mb-4" :disabled="disabled" :flat="flat" :outlined="outlined">
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title>{{ label }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="!availableLocales.length"
            color="secondary"
            fab
            small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>fa-plus</v-icon>
          </v-btn>
        </template>
        <v-list class="grey lighten-3">
          <v-list-item v-for="locale in availableLocales" :key="locale" @click="add(locale)">
            <span :class="`flag-icon flag-icon-${localeToFlag(locale)} mr-3`"></span>
            <span class="font-weight-medium">{{ $t(`common.locales.${locale}`) }}</span>
          </v-list-item>
        </v-list>
      </v-menu>
      <template v-slot:extension>
        <v-tabs v-model="selected" background-color="grey lighten-4">
          <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="locale in locales" :key="locale">
            <span :class="`flag-icon flag-icon-${localeToFlag(locale)} mr-3`"></span>
            <span class="font-weight-medium">{{ $t(`common.locales.${locale}`) }}</span>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="selected">
      <v-tab-item v-for="locale in locales" :key="locale">
        <v-card-text>
          <slot :name="`locale.${locale}`" v-bind:locale="locale"></slot>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="doNotRemove.includes(locales[selected])"
            color="error"
            text
            @click.stop="remove(locales[selected])"
          >
            <v-icon class="mr-2">fa-trash</v-icon> {{ $t('common.action.delete') }}
          </v-btn>
        </v-card-actions>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import tinymce from '@/components/tinymce/tinymce';

export default Vue.extend({
  name: 'SelectLocale',

  mixins: [tinymce],

  props: {
    label: {
      type: String,
    },
    value: {
      type: Object,
    },
    default: {
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      default: undefined,
    },
    outlined: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      selected: null as number | null,
      doNotRemove: ['en'],
    };
  },

  computed: {
    locales(): string[] {
      return Object.keys(this.value);
    },
    availableLocales(): string[] {
      // TODO: this should return available langs in frontend apps - once implemented
      // return this.$i18n.availableLocales.filter((locale) => !this.locales.includes(locale));
      return ['en', 'es', 'dk', 'pt'].filter((locale) => !this.locales.includes(locale));
    },
  },

  methods: {
    localeToFlag(locale: string): string {
      switch (locale) {
        case 'en':
          return 'gb';
        default:
          return locale;
      }
    },

    async add(locale: string) {
      await this.$emit('input', { ...this.value, [locale]: this.default });
      this.selected = this.locales.length - 1;
    },

    remove(locale: string) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [locale]: remove, ...rest } = this.value;
      this.$emit('input', { ...rest });
    },
  },
});
</script>

<style lang="scss" scoped></style>
