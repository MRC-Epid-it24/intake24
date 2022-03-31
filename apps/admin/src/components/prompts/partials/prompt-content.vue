<template>
  <v-tab-item key="content">
    <language-selector
      :label="$t('survey-schemes.questions.name._')"
      :value="name"
      @input="update('name', $event)"
    >
      <template v-for="lang in Object.keys(name)" v-slot:[`lang.${lang}`]>
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
      :label="$t('survey-schemes.questions.text._')"
      :value="text"
      @input="update('text', $event)"
    >
      <template v-for="lang in Object.keys(text)" v-slot:[`lang.${lang}`]>
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
      :label="$t('survey-schemes.questions.description._')"
      :value="description"
      @input="update('description', $event)"
    >
      <template v-for="lang in Object.keys(description)" v-slot:[`lang.${lang}`]>
        <editor
          :init="tinymceInit"
          :key="lang"
          :value="description[lang]"
          @input="updateLanguage('description', lang, $event)"
        />
      </template>
    </language-selector>
  </v-tab-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { LocaleTranslation } from '@intake24/common/types';
import tinymce from '@intake24/admin/components/tinymce/tinymce';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { RuleCallback } from '@intake24/admin/types';

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
    text: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    textRequired: {
      type: Boolean,
      default: true,
    },
    description: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
  },

  computed: {
    nameRules(): RuleCallback[] {
      return [
        (value: string | null): boolean | string =>
          !!value || this.$t('survey-schemes.questions.name.required').toString(),
      ];
    },
    textRules(): RuleCallback[] {
      return this.textRequired
        ? [
            (value: string | null): boolean | string =>
              !!value || this.$t('survey-schemes.questions.text.required').toString(),
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
