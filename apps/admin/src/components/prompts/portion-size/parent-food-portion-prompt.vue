<template>
  <v-tab-item key="options" value="options">
    <v-row class="mb-3">
      <v-col cols="12" md="6">
        <v-switch
          hide-details="auto"
          :input-value="badges"
          :label="$t('survey-schemes.prompts.badges')"
          @change="update('badges', $event)"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          hide-details="auto"
          :items="orientations"
          :label="$t('survey-schemes.prompts.orientation._')"
          outlined
          :value="orientation"
          @change="update('orientation', $event)"
        />
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import { useSelects } from '@intake24/admin/composables';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'ParentFoodPortionPrompt',

  mixins: [basePrompt],

  props: {
    badges: {
      type: Boolean as PropType<Prompts['parent-food-portion-prompt']['badges']>,
      required: true,
    },
    orientation: {
      type: String as PropType<Prompts['parent-food-portion-prompt']['orientation']>,
      required: true,
    },
  },

  setup() {
    const { orientations } = useSelects();

    return {
      orientations,
    };
  },
});
</script>

<style lang="scss" scoped></style>
