<template>
  <v-tab-item key="options" value="options">
    <v-row class="mb-3">
      <v-col cols="12">
        <v-switch
          hide-details="auto"
          :input-value="multiple"
          :label="$t('survey-schemes.prompts.multiple')"
          @change="update('multiple', $event)"
        />
      </v-col>
    </v-row>
    <language-selector
      :default="[]"
      :label="$t('common.options.title').toString()"
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
import { LanguageSelector } from '@intake24/admin/components/forms';
import { OptionsList } from '@intake24/admin/components/lists';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'SelectPrompt',

  components: { OptionsList, LanguageSelector },

  mixins: [basePrompt],

  props: {
    multiple: {
      type: Boolean as PropType<Prompts['select-prompt']['multiple']>,
      required: true,
    },
    options: {
      type: Object as PropType<Prompts['select-prompt']['options']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
