<template>
  <v-tab-item key="options" value="options">
    <v-row class="mb-3">
      <v-col cols="12">
        <v-select
          hide-details="auto"
          :items="orientations"
          :label="$t('survey-schemes.prompts.orientation._')"
          outlined
          :value="orientation"
          @change="update('orientation', $event)"
        />
      </v-col>
      <v-col cols="12">
        <v-switch
          hide-details="auto"
          :input-value="other"
          :label="$t('survey-schemes.prompts.other')"
          @change="update('other', $event)"
        />
      </v-col>
    </v-row>
    <language-selector
      :default="[]"
      :label="$t('common.options.title')"
      :required="true"
      :value="options"
      @input="update('options', $event)"
    >
      <template v-for="lang in Object.keys(options)" #[`lang.${lang}`]>
        <options-list
          :key="lang"
          :options="options[lang]"
          @update:options="updateLanguage('options', lang, $event)"
        />
      </template>
    </language-selector>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import { useSelects } from '@intake24/admin/composables';

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

  setup() {
    const { orientations } = useSelects();

    return { orientations };
  },
});
</script>

<style lang="scss" scoped></style>
