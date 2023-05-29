<template>
  <div>
    <prompt-validation v-bind.sync="validation"></prompt-validation>
    <v-tab-item key="options">
      <v-row class="mb-3">
        <v-col cols="12">
          <v-select
            hide-details="auto"
            :items="orientations"
            :label="$t('survey-schemes.questions.orientation._')"
            outlined
            :value="orientation"
            @change="update('orientation', $event)"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-switch
            hide-details="auto"
            :input-value="other"
            :label="$t('survey-schemes.questions.other')"
            @change="update('other', $event)"
          ></v-switch>
        </v-col>
      </v-row>
      <language-selector
        :default="[]"
        :label="$t('survey-schemes.questions.options.title')"
        :required="true"
        :value="options"
        @input="update('options', $event)"
      >
        <template v-for="lang in Object.keys(options)" #[`lang.${lang}`]>
          <prompt-list-options
            :key="lang"
            :options="options[lang]"
            @update:options="updateLanguage('options', lang, $event)"
          ></prompt-list-options>
        </template>
      </language-selector>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { selectListPrompt } from '../partials';

export default defineComponent({
  name: 'RadioListPrompt',

  mixins: [selectListPrompt],

  props: {
    orientation: {
      type: String as PropType<Prompts['radio-list-prompt']['orientation']>,
      required: true,
    },
  },

  data() {
    return {
      orientations: ['column', 'row'].map((value) => ({
        text: this.$t(`survey-schemes.questions.orientation.${value}`),
        value,
      })),
    };
  },
});
</script>

<style lang="scss" scoped></style>
