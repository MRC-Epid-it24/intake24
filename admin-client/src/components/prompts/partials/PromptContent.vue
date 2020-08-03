<template>
  <v-tab-item key="content">
    <select-locale
      :label="$t('schemes.questions.text')"
      :value="text"
      @input="update('text', $event)"
    >
      <template v-for="locale in Object.keys(text)" v-slot:[`locale.${locale}`]>
        <v-text-field
          :key="locale"
          :label="$t('schemes.questions.text')"
          :rules="textRules"
          :value="text[locale]"
          hide-details="auto"
          outlined
          @input="updateLocale('text', locale, $event)"
        ></v-text-field>
      </template>
    </select-locale>
    <select-locale
      :label="$t('schemes.questions.description')"
      :value="description"
      @input="update('description', $event)"
    >
      <template v-for="locale in Object.keys(description)" v-slot:[`locale.${locale}`]>
        <editor
          :init="tinymceInit"
          :key="locale"
          :value="description[locale]"
          @input="updateLocale('description', locale, $event)"
        />
      </template>
    </select-locale>
  </v-tab-item>
</template>

<script lang="ts">
import Vue from 'vue';
import tinymce from '@/components/tinymce/tinymce';
import { LocaleTranslation } from '@common/types/common';
import SelectLocale from './SelectLocale.vue';

export default Vue.extend({
  name: 'PromptContent',

  components: { SelectLocale },

  mixins: [tinymce],

  props: {
    text: {
      type: Object as () => LocaleTranslation,
    },
    description: {
      type: Object as () => LocaleTranslation,
    },
  },

  computed: {
    textRules() {
      return [(value: string | null): boolean | string => !!value || 'Question text is required.'];
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
    updateLocale(field: string, locale: string, value: any) {
      this.$emit(`update:${field}`, { ...this.$props[field], [locale]: value });
    },
  },
});
</script>

<style lang="scss" scoped></style>
