<template>
  <v-card class="mb-4" :disabled="disabled" :flat="flat" :outlined="outlined">
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title>{{ label }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :disabled="!availableLanguages.length"
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
          <v-list-item v-for="lang in availableLanguages" :key="lang.id" @click="add(lang.id)">
            <span :class="`fi fi-${lang.countryFlagCode} mr-3`"></span>
            <span class="font-weight-medium">{{ lang.englishName }}</span>
          </v-list-item>
        </v-list>
      </v-menu>
      <template v-slot:extension>
        <v-tabs v-model="selected" background-color="grey lighten-4">
          <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="lang in languages" :key="lang">
            <span :class="`fi fi-${getLanguageFlag(lang)} mr-3`"></span>
            <span class="font-weight-medium">{{ getLanguageName(lang) }}</span>
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="selected">
      <v-tab-item v-for="lang in languages" :key="lang">
        <v-card-text>
          <slot :name="`lang.${lang}`" v-bind:lang="lang"></slot>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="doNotRemove.includes(languages[selected])"
            color="error"
            text
            @click.stop="remove(languages[selected])"
          >
            <v-icon class="mr-2">$delete</v-icon> {{ $t('common.action.delete') }}
          </v-btn>
        </v-card-actions>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { SurveySchemeRefs, LanguageListEntry } from '@intake24/common/types/http/admin';
import tinymce from '@intake24/admin/components/tinymce/tinymce';
import mapRefs from '@intake24/admin/components/entry/map-refs';
import { MapRefsMixin } from '@intake24/admin/types';

export default (Vue as VueConstructor<Vue & MapRefsMixin<SurveySchemeRefs>>).extend({
  name: 'LanguageSelector',

  mixins: [mapRefs, tinymce],

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
    languages(): string[] {
      return Object.keys(this.value);
    },
    // Language refs should through provide/injected or something (relies too much on entry reference)
    availableLanguages(): LanguageListEntry[] {
      if (!this.refsLoaded) return [];

      return this.refs.languages.filter((lang) => !this.languages.includes(lang.id));
    },
  },

  methods: {
    getLanguageFlag(langId: string) {
      if (!this.refsLoaded) return 'gb';

      const language = this.refs.languages.find((lang) => lang.id === langId);

      return language?.countryFlagCode ?? 'gb';
    },

    getLanguageName(langId: string) {
      if (!this.refsLoaded) return 'English';

      const language = this.refs.languages.find((lang) => lang.id === langId);

      return language?.englishName ?? 'English';
    },

    async add(langId: string) {
      this.$emit('input', { ...this.value, [langId]: this.default });
      this.selected = this.languages.length - 1;
    },

    remove(langId: string) {
      const { [langId]: remove, ...rest } = this.value;
      this.$emit('input', { ...rest });
    },
  },
});
</script>

<style lang="scss" scoped></style>
