<template>
  <food-search-prompt
    v-bind="{ food: freeTextFood(), localeId, prompt }"
    v-model="searchTerm"
    @food-selected="foodSelected"
  ></food-search-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent, ref } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { FoodState } from '@intake24/common/types';
import type { UserFoodData } from '@intake24/common/types/http';
import { FoodSearchPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils } from '../mixins';

export default defineComponent({
  name: 'FoodSearchPromptHandler',

  components: { FoodSearchPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['food-search-prompt']>,
      required: true,
    },
  },

  setup() {
    const { freeTextFood, localeId } = useFoodPromptUtils();

    const foodData = ref<UserFoodData | undefined>(undefined);
    const searchTerm = ref(freeTextFood().description);

    return { freeTextFood, localeId, foodData, searchTerm };
  },

  methods: {
    ...mapActions(useSurvey, ['replaceFood', 'getNextFoodId']),

    foodSelected(foodData: UserFoodData) {
      this.foodData = foodData;
      this.commitAnswer();
      this.$emit('action', 'next');
    },

    commitAnswer() {
      const { foodData, searchTerm } = this;
      if (foodData === undefined) {
        console.warn('FoodSearchPromptHandler: foodData is undefined.');
        return;
      }

      const { id, customPromptAnswers, flags } = this.freeTextFood();

      // Automatically select the only portion size method available to avoid triggering
      // redundant portion size option prompt
      const portionSizeMethodIndex = foodData.portionSizeMethods.length === 1 ? 0 : null;

      const newState: FoodState = {
        id,
        type: 'encoded-food',
        data: foodData,
        searchTerm,
        portionSizeMethodIndex,
        portionSize: null,
        customPromptAnswers,
        flags,
        linkedFoods: [],
        associatedFoodsComplete: false,
      };

      this.replaceFood({ foodId: id, food: newState });
    },
  },
});
</script>

<style scoped></style>
