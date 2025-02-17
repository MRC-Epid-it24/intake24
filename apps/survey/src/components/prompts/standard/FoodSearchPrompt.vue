<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text>
      <food-browser
        v-bind="{ localeId, surveySlug, prompt, section, rootCategory, modelValue }"
        @food-missing="foodMissing"
        @food-selected="foodSelected"
        @recipe-builder="recipeBuilder"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </v-card-text>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { FoodState, SearchSortingAlgorithm } from '@intake24/common/surveys';
import type { RecipeFood } from '@intake24/common/types';
import type { FoodHeader } from '@intake24/common/types/http';
import { FoodBrowser } from '@intake24/survey/components/elements';
import { usePromptUtils } from '@intake24/survey/composables';
import { foodsService } from '@intake24/survey/services';

import createBasePrompt from '../createBasePrompt';

export type FoodSearchPromptParameters = {
  matchScoreWeight?: number;
  rankingAlgorithm?: SearchSortingAlgorithm;
};

export default defineComponent({
  name: 'FoodSearchPrompt',

  components: { FoodBrowser },

  mixins: [createBasePrompt<'food-search-prompt', FoodState>()],

  props: {
    localeId: {
      type: String,
      required: true,
    },
    surveySlug: {
      type: String,
    },
    modelValue: {
      type: String as PropType<string | null>,
      required: true,
    },
  },

  emits: ['action', 'food-missing', 'food-selected', 'update:modelValue', 'recipe-builder'],

  setup(props, ctx) {
    const { action } = usePromptUtils(props, ctx);

    const isValid = true;
    const rootCategory = computed(() => {
      const foodSearch = props.meal?.flags?.find(flag => flag.startsWith('food-search:'))?.split(':')[1];

      if (!foodSearch)
        return undefined;

      const [foodsCategory, drinksCategory] = foodSearch.split('|');

      return props.food?.flags.includes('is-drink') ? drinksCategory : foodsCategory;
    });

    const foodSelected = async (food: FoodHeader) => {
      const foodData = await foodsService.getData(props.localeId, food.code);
      // Food data API returns the main local food name.
      // Override it here with the selected name (which could be one of the
      // alternative food names or the main name).
      foodData.localName = food.name;
      ctx.emit('food-selected', foodData);
    };

    const foodMissing = (searchTerm?: string | null) => {
      ctx.emit('food-missing', searchTerm);
    };

    const recipeBuilder = (recipeFood: RecipeFood) => {
      ctx.emit('recipe-builder', recipeFood);
    };

    return {
      action,
      foodSelected,
      foodMissing,
      recipeBuilder,
      isValid,
      rootCategory,
    };
  },
});
</script>

<style lang="scss" scoped></style>
