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
        <select-locale
          :disabled="!required"
          :label="$t('schemes.questions.validation.message')"
          :value="message"
          @input="update('message', $event)"
        >
          <template v-for="locale in Object.keys(message)" v-slot:[`locale.${locale}`]>
            <v-text-field
              :disabled="!required"
              :key="locale"
              :label="$t('schemes.questions.validation.message')"
              :value="message[locale]"
              hide-details="auto"
              outlined
              @input="updateLocale('message', locale, $event)"
            ></v-text-field>
          </template>
        </select-locale>
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import Vue from 'vue';
import { LocaleTranslation } from '@common/types/common';
import SelectLocale from './SelectLocale.vue';

export default Vue.extend({
  name: 'PromptValidation',

  components: { SelectLocale },

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
    updateLocale(field: string, locale: string, value: any) {
      this.$emit(`update:${field}`, { ...this.$props[field], [locale]: value });
    },
  },
});
</script>

<style lang="scss" scoped></style>
