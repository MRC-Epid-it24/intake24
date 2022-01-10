<template>
  <v-tab-item key="validation">
    <v-row>
      <v-col cols="12">
        <v-switch
          :input-value="required"
          :label="$t('schemes.questions.validation.required')"
          hide-details="auto"
          @change="update('required', $event)"
        ></v-switch>
      </v-col>
      <v-col cols="12">
        <language-selector
          :disabled="!required"
          :label="$t('schemes.questions.validation.message')"
          :value="message"
          @input="update('message', $event)"
        >
          <template v-for="lang in Object.keys(message)" v-slot:[`lang.${lang}`]>
            <v-text-field
              :disabled="!required"
              :key="lang"
              :label="$t('schemes.questions.validation.message')"
              :value="message[lang]"
              hide-details="auto"
              outlined
              @input="updateLanguage('message', lang, $event)"
            ></v-text-field>
          </template>
        </language-selector>
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import Vue from 'vue';
import { LocaleTranslation } from '@intake24/common/types';
import LanguageSelector from './language-selector.vue';

export default Vue.extend({
  name: 'PromptValidation',

  components: { LanguageSelector },

  props: {
    required: {
      type: Boolean,
    },
    message: {
      type: Object as () => LocaleTranslation,
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
