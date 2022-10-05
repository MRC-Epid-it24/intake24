<template>
  <v-card class="mb-4" :disabled="disabled" :flat="flat" :outlined="outlined">
    <v-toolbar color="grey lighten-4" flat>
      <v-toolbar-title>{{ label }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template #activator="{ on, attrs }">
          <v-btn
            color="secondary"
            :disabled="!availableLanguages.length"
            fab
            small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>$add</v-icon>
          </v-btn>
        </template>
        <v-list class="grey lighten-3">
          <v-list-item v-for="lang in availableLanguages" :key="lang.code" @click="add(lang.code)">
            <span :class="`fi fi-${lang.countryFlagCode} mr-3`"></span>
            <span class="font-weight-medium">{{ lang.englishName }}</span>
          </v-list-item>
        </v-list>
      </v-menu>
      <template #extension>
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
          <slot :lang="lang" :name="`lang.${lang}`"></slot>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" :disabled="isRemoveDisabled" text @click.stop="remove">
            <v-icon left>$delete</v-icon> {{ $t('common.action.delete') }}
          </v-btn>
        </v-card-actions>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { LocaleOptionList } from '@intake24/common/prompts';
import type { LocaleTranslation, RequiredLocaleTranslation } from '@intake24/common/types';
import type { LanguageListEntry } from '@intake24/common/types/http/admin';
import { useEntry } from '@intake24/admin/stores';

export default defineComponent({
  name: 'LanguageSelector',

  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Object as PropType<LocaleTranslation | RequiredLocaleTranslation | LocaleOptionList>,
      required: true,
    },
    default: {
      type: [String, Array],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
    },
    outlined: {
      type: Boolean,
      default: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      selected: undefined as number | undefined,
      doNotRemove: this.required ? ['en'] : [],
    };
  },

  computed: {
    languages(): string[] {
      return Object.keys(this.value);
    },
    allLanguages(): LanguageListEntry[] {
      return (
        useEntry().refs.languages ?? [
          { code: 'en', englishName: 'English', localName: 'English', countryFlagCode: 'gb' },
        ]
      );
    },
    availableLanguages(): LanguageListEntry[] {
      return this.allLanguages.filter((lang) => !this.languages.includes(lang.code));
    },
    isRemoveDisabled(): boolean {
      if (this.selected === undefined) return true;

      return this.doNotRemove.includes(this.languages[this.selected]);
    },
  },

  methods: {
    getLanguageFlag(code: string) {
      const language = this.allLanguages.find((lang) => lang.code === code);

      return language?.countryFlagCode ?? 'gb';
    },

    getLanguageName(code: string) {
      const language = this.allLanguages.find((lang) => lang.code === code);

      return language?.englishName ?? 'English';
    },

    async add(code: string) {
      this.$emit('input', { ...this.value, [code]: this.default });
      this.selected = this.languages.length - 1;
    },

    remove() {
      if (this.selected === undefined) return;

      const code = this.languages[this.selected];
      const { [code]: remove, ...rest } = this.value;
      this.$emit('input', { ...rest });
    },
  },
});
</script>

<style lang="scss" scoped></style>
