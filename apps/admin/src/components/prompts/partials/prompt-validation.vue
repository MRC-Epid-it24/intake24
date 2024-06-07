<template>
  <v-tab-item key="validation" value="validation">
    <v-row>
      <v-col cols="12">
        <v-switch
          hide-details="auto"
          :input-value="validation.required"
          :label="$t('survey-schemes.prompts.validation.required')"
          name="validation.required"
          @change="update('required', $event)"
        />
      </v-col>
      <v-col cols="12">
        <language-selector
          :disabled="!validation.required"
          :label="$t('survey-schemes.prompts.validation.message').toString()"
          :value="validation.message"
          @input="update('message', $event)"
        >
          <template v-for="lang in Object.keys(validation.message)" #[`lang.${lang}`]>
            <v-text-field
              :key="lang"
              :disabled="!validation.required"
              hide-details="auto"
              :label="$t('survey-schemes.prompts.validation.message')"
              outlined
              :value="validation.message[lang]"
              @input="updateLanguage('message', lang, $event)"
            />
          </template>
        </language-selector>
      </v-col>
      <template v-if="limits">
        <v-col cols="6">
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.validation.min')"
            name="validation.min"
            outlined
            :value="validation.min"
            @input="update('min', toInteger($event))"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.validation.max')"
            name="validation.max"
            outlined
            :value="validation.max"
            @input="update('max', toInteger($event))"
          />
        </v-col>
      </template>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { PromptValidationWithLimits } from '@intake24/common/prompts';
import { LanguageSelector } from '@intake24/admin/components/forms';

export type LocaleTranslationKeys = 'message';

export default defineComponent({
  name: 'PromptValidation',

  components: { LanguageSelector },

  props: {
    limits: {
      type: Boolean,
    },
    validation: {
      type: Object as PropType<PromptValidationWithLimits>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const toInteger = (value: string): number | null => {
      const val = Number.parseInt(value);
      return Number.isNaN(val) ? null : val;
    };

    const update = (field: string, value: any) => {
      emit('update:validation', { ...props.validation, [field]: value });
    };
    const updateLanguage = (field: LocaleTranslationKeys, locale: string, value: any) => {
      emit('update:validation', { ...props.validation, [field]: { ...props.validation[field], [locale]: value } });
    };

    return { toInteger, update, updateLanguage };
  },
});
</script>

<style lang="scss" scoped></style>
