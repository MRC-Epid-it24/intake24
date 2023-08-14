<template>
  <v-tab-item key="options">
    <v-row>
      <v-col cols="12">
        <v-switch
          hide-details="auto"
          :input-value="separateDrinks"
          :label="$t('survey-schemes.prompts.edit-meal-prompt.separateDrinks')"
          @change="update('separateDrinks', $event)"
        ></v-switch>
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'EditMealPrompt',

  mixins: [basePrompt],

  props: {
    separateDrinks: {
      type: Boolean as PropType<Prompts['edit-meal-prompt']['separateDrinks']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
