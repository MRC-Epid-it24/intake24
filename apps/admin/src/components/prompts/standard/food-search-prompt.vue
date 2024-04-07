<template>
  <v-tab-item key="options" value="options">
    <v-row>
      <v-col cols="12" md="6">
        <v-switch
          hide-details="auto"
          :input-value="allowBrowsing"
          :label="$t('survey-schemes.prompts.food-search-prompt.allowBrowsing')"
          @change="update('allowBrowsing', $event)"
        />
        <v-switch
          hide-details="auto"
          :input-value="dualLanguage"
          :label="$t('survey-schemes.prompts.food-search-prompt.dualLanguage')"
          @change="update('dualLanguage', $event)"
        />
      </v-col>
      <v-col cols="12" md="6">
        <food-browser-settings
          :categories-first="categoriesFirst"
          @update:categoriesFirst="update('categoriesFirst', $event)"
        />
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt, FoodBrowserSettings } from '../partials';

export default defineComponent({
  name: 'FoodSearchPrompt',

  components: { FoodBrowserSettings },

  mixins: [basePrompt],

  props: {
    categoriesFirst: {
      type: Object as PropType<Prompts['food-search-prompt']['categoriesFirst']>,
      required: true,
    },
    allowBrowsing: {
      type: Boolean as PropType<Prompts['food-search-prompt']['allowBrowsing']>,
      required: true,
    },
    dualLanguage: {
      type: Boolean as PropType<Prompts['food-search-prompt']['dualLanguage']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
