<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }" @action="action">
    <v-card-text>
      <food-browser
        v-bind="{ localeId, parameters, type, value }"
        @food-missing="foodMissing"
        @food-selected="foodSelected"
        @input="$emit('input', $event)"
      ></food-browser>
    </v-card-text>
    <template #actions>
      <!-- Should not have actions -> only click & select -->
      <div></div>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { SearchSortingAlgorithm } from '@intake24/common/surveys';
import type { FreeTextFood } from '@intake24/common/types';
import type { FoodHeader } from '@intake24/common/types/http';
import { FoodBrowser } from '@intake24/survey/components/elements';
import { foodsService } from '@intake24/survey/services';

import createBasePrompt from '../createBasePrompt';

export type FoodSearchPromptParameters = {
  matchScoreWeight?: number;
  rankingAlgorithm?: SearchSortingAlgorithm;
};

export default defineComponent({
  name: 'FoodSearchPrompt',

  components: { FoodBrowser },

  mixins: [createBasePrompt<'food-search-prompt', FreeTextFood>()],

  props: {
    localeId: {
      type: String,
      required: true,
    },
    parameters: {
      type: Object as PropType<FoodSearchPromptParameters>,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },

  emits: ['food-missing', 'food-selected', 'input'],

  setup(props, { emit }) {
    const foodSelected = async (food: FoodHeader) => {
      const foodData = await foodsService.getData(props.localeId, food.code);
      emit('food-selected', foodData);
    };

    const foodMissing = () => {
      emit('food-missing');
    };

    return {
      foodSelected,
      foodMissing,
    };
  },
});
</script>

<style lang="scss" scoped></style>
