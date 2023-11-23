<template>
  <v-tab-item key="options" value="options">
    <v-row class="mb-3">
      <v-col cols="12" md="6">
        <food-browser-settings
          :categories-first="categoriesFirst"
          @update:categoriesFirst="update('categoriesFirst', $event)"
        >
        </food-browser-settings>
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
  name: 'RecipeBuilderFoodPrompt',

  components: { FoodBrowserSettings },

  mixins: [basePrompt],

  props: {
    categoriesFirst: {
      type: Object as PropType<Prompts['recipe-builder-prompt']['categoriesFirst']>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
