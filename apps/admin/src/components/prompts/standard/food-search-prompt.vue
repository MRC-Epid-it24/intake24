<template>
  <div>
    <v-tab-item key="options">
      <v-row>
        <v-col cols="12">
          <v-switch
            hide-details="auto"
            :input-value="allowBrowsing"
            :label="$t('survey-schemes.prompts.food-search-prompt.allowBrowsing')"
            @change="update('allowBrowsing', $event)"
          ></v-switch>
        </v-col>
        <v-col cols="12">
          <v-switch
            hide-details="auto"
            :input-value="dualLanguage"
            :label="$t('survey-schemes.prompts.food-search-prompt.dualLanguage')"
            @change="update('dualLanguage', $event)"
          ></v-switch>
        </v-col>
      </v-row>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'FoodSearchPrompt',

  mixins: [basePrompt],

  props: {
    allowBrowsing: {
      type: Boolean as PropType<Prompts['food-search-prompt']['allowBrowsing']>,
      default: true,
    },
    dualLanguage: {
      type: Boolean as PropType<Prompts['food-search-prompt']['dualLanguage']>,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped></style>
