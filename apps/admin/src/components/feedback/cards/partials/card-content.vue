<template>
  <v-tab-item key="content">
    <language-selector
      :label="$t('feedback-schemes.cards.name').toString()"
      :value="name"
      @input="update('name', $event)"
    >
      <template v-for="lang in Object.keys(name)" #[`lang.${lang}`]>
        <v-text-field
          :key="lang"
          hide-details="auto"
          :label="$t('feedback-schemes.cards.name')"
          outlined
          :rules="nameRules"
          :value="name[lang]"
          @input="updateLanguage('name', lang, $event)"
        ></v-text-field>
      </template>
    </language-selector>
    <language-selector
      :label="$t('feedback-schemes.cards.summary').toString()"
      :value="summary"
      @input="update('summary', $event)"
    >
      <template v-for="lang in Object.keys(summary)" #[`lang.${lang}`]>
        <html-editor
          :key="lang"
          :value="summary[lang]"
          @input="updateLanguage('summary', lang, $event)"
        ></html-editor>
      </template>
    </language-selector>
    <language-selector
      :label="$t('feedback-schemes.cards.description').toString()"
      :value="description"
      @input="update('description', $event)"
    >
      <template v-for="lang in Object.keys(description)" #[`lang.${lang}`]>
        <html-editor
          :key="lang"
          :value="description[lang]"
          @input="updateLanguage('description', lang, $event)"
        ></html-editor>
      </template>
    </language-selector>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { RuleCallback } from '@intake24/admin/types';
import type { CustomCard } from '@intake24/common/feedback';
import { HtmlEditor } from '@intake24/admin/components/editors';
import { LanguageSelector } from '@intake24/admin/components/forms';

export type LocaleTranslationKeys = 'name' | 'description' | 'summary';

export default defineComponent({
  name: 'CardContent',

  components: { HtmlEditor, LanguageSelector },

  props: {
    name: {
      type: Object as PropType<CustomCard['name']>,
      required: true,
    },
    nameRequired: {
      type: Boolean,
      default: true,
    },
    summary: {
      type: Object as PropType<CustomCard['summary']>,
      required: true,
    },
    description: {
      type: Object as PropType<CustomCard['description']>,
      required: true,
    },
  },

  computed: {
    nameRules(): RuleCallback[] {
      return this.nameRequired
        ? [
            (value: string | null): boolean | string =>
              !!value || this.$t('feedback-schemes.cards.required').toString(),
          ]
        : [];
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
    updateLanguage(field: LocaleTranslationKeys, locale: string, value: any) {
      this.$emit(`update:${field}`, { ...this.$props[field], [locale]: value });
    },
  },
});
</script>

<style lang="scss" scoped></style>
