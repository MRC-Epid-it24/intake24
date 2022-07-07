<template>
  <v-tab-item key="validation">
    <v-row>
      <v-col cols="12">
        <v-switch
          :input-value="required"
          :label="$t('survey-schemes.questions.validation.required')"
          hide-details="auto"
          @change="update('required', $event)"
        ></v-switch>
      </v-col>
      <v-col cols="12">
        <language-selector
          :disabled="!required"
          :label="$t('survey-schemes.questions.validation.message')"
          :value="message"
          @input="update('message', $event)"
        >
          <template v-for="lang in Object.keys(message)" v-slot:[`lang.${lang}`]>
            <v-text-field
              :disabled="!required"
              :key="lang"
              :label="$t('survey-schemes.questions.validation.message')"
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
import type { LocaleTranslation } from '@intake24/common/types';
import { LanguageSelector } from '@intake24/admin/components/forms';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export type LocaleTranslationKeys = 'message';

export default defineComponent({
  name: 'PromptValidation',

  components: { LanguageSelector },

  props: {
    required: {
      type: Boolean,
      required: true,
    },
    message: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
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
