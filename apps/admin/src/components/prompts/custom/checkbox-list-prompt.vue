<template>
  <v-tab-item key="options" value="options">
    <v-row class="mb-3">
      <v-col cols="12">
        <v-switch
          hide-details="auto"
          :input-value="other"
          :label="$t('survey-schemes.prompts.other')"
          @change="update('other', $event)"
        ></v-switch>
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
        ></options-list>
      </template>
    </language-selector>
  </v-tab-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { selectListPrompt } from '../partials';

export default defineComponent({
  name: 'CheckboxListPrompt',

  mixins: [selectListPrompt],
});
</script>

<style lang="scss" scoped></style>
