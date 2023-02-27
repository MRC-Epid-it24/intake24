<template>
  <div>
    <v-tab-item key="options">
      <v-row>
        <v-col cols="12">
          <v-switch
            hide-details="auto"
            :input-value="custom"
            :label="$t('survey-schemes.prompts.meal-add-prompt.custom')"
            @change="update('custom', $event)"
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
  name: 'MealAddPrompt',

  mixins: [basePrompt],

  props: {
    custom: {
      type: Boolean as PropType<Prompts['meal-add-prompt']['custom']>,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped></style>
