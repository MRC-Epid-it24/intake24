<template>
  <v-tab-item key="content">
    <language-selector
      :label="$t('schemes.questions.text')"
      :value="text"
      @input="update('text', $event)"
    >
      <template v-for="lang in Object.keys(text)" v-slot:[`lang.${lang}`]>
        <v-text-field
          :key="lang"
          :label="$t('schemes.questions.text')"
          :rules="textRules"
          :value="text[lang]"
          hide-details="auto"
          outlined
          @input="updateLanguage('text', lang, $event)"
        ></v-text-field>
      </template>
    </language-selector>
    <language-selector
      :label="$t('schemes.questions.description')"
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
import Vue from 'vue';
import { LocaleTranslation } from '@common/types';
import tinymce from '@/components/tinymce/tinymce';
import LanguageSelector from './language-selector.vue';

export default Vue.extend({
  name: 'PromptContent',

  components: { LanguageSelector },

  mixins: [tinymce],

  props: {
    text: {
      type: Object as () => LocaleTranslation,
    },
    textRequired: {
      type: Boolean,
      default: true,
    },
    description: {
      type: Object as () => LocaleTranslation,
    },
  },

  computed: {
    textRules() {
      return this.textRequired
        ? [(value: string | null): boolean | string => !!value || 'Question text is required.']
        : [];
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
    updateLanguage(field: string, locale: string, value: any) {
      this.$emit(`update:${field}`, { ...this.$props[field], [locale]: value });
    },
  },
});
</script>

<style lang="scss" scoped></style>
