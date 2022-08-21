<template>
  <v-tab-item key="content">
    <language-selector
      :label="$t('survey-schemes.questions.name._').toString()"
      :required="nameRequired"
      :value="name"
      @input="update('name', $event)"
    >
      <template v-for="lang in Object.keys(name)" #[`lang.${lang}`]>
        <v-text-field
          :key="lang"
          :label="$t('survey-schemes.questions.name._')"
          :rules="nameRules"
          :value="name[lang]"
          hide-details="auto"
          outlined
          @input="updateLanguage('name', lang, $event)"
        ></v-text-field>
      </template>
    </language-selector>
    <language-selector
      :label="$t('survey-schemes.questions.text._').toString()"
      :required="textRequired"
      :value="text"
      @input="update('text', $event)"
    >
      <template v-for="lang in Object.keys(text)" #[`lang.${lang}`]>
        <v-text-field
          :key="lang"
          :label="$t('survey-schemes.questions.text._')"
          :rules="textRules"
          :value="text[lang]"
          hide-details="auto"
          outlined
          @input="updateLanguage('text', lang, $event)"
        ></v-text-field>
      </template>
    </language-selector>
    <language-selector
      :label="$t('survey-schemes.questions.description._').toString()"
      :required="descriptionRequired"
      :value="description"
      @input="update('description', $event)"
    >
      <template v-for="lang in Object.keys(description)" #[`lang.${lang}`]>
        <editor
          :key="lang"
          :init="tinymceInit"
          :value="description[lang]"
          @input="updateLanguage('description', lang, $event)"
        />
      </template>
    </language-selector>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { RuleCallback } from '@intake24/admin/types';
import type { LocaleTranslation } from '@intake24/common/types';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { tinymce } from '@intake24/admin/components/tinymce';

export type LocaleTranslationKeys = 'name' | 'text' | 'description';

export default defineComponent({
  name: 'PromptContent',

  components: { LanguageSelector },

  mixins: [tinymce],

  props: {
    name: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    nameRequired: {
      type: Boolean,
      default: true,
    },
    text: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    textRequired: {
      type: Boolean,
      default: false,
    },
    description: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    descriptionRequired: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    nameRules(): RuleCallback[] {
      if (!this.nameRequired) return [];

      return [this.valueRequiredCallBack('name')];
    },
    textRules(): RuleCallback[] {
      if (!this.textRequired) return [];

      return [this.valueRequiredCallBack('text')];
    },
    descriptionRules(): RuleCallback[] {
      if (!this.descriptionRequired) return [];

      return [this.valueRequiredCallBack('description')];
    },
  },

  methods: {
    valueRequiredCallBack(field: 'name' | 'text' | 'description') {
      return (value: string | null): boolean | string =>
        !!value || this.$t(`survey-schemes.questions.${field}.required`).toString();
    },
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
