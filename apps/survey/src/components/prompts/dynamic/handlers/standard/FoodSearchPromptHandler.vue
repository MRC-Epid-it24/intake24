<template>
  <food-search-prompt
    :prompt-props="promptProps"
    :initial-search-term="selectedFoodDescription"
    @food-selected="onFoodSelected"
  ></food-search-prompt>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import type { FoodSearchPromptProps } from '@intake24/common/prompts';
import type { FoodState } from '@intake24/common/types';
import type { UserFoodData } from '@intake24/common/types/http';
import FoodSearchPrompt from '@intake24/survey/components/prompts/standard/FoodSearchPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
import type { PropType } from 'vue';
import { createPromptStoreMixin } from '@intake24/survey/components/prompts/dynamic/handlers/mixins/prompt-store';
import FoodPromptUtils from '@intake24/survey/components/prompts/dynamic/handlers/mixins/food-prompt-utils';

export default defineComponent({
  name: 'FoodSearchPromptHandler',

  components: { FoodSearchPrompt },

  mixins: [createPromptStoreMixin<never>('food-search-prompt'), FoodPromptUtils],

  props: {
    promptProps: {
      type: Object as PropType<FoodSearchPromptProps>,
      required: true,
    },
  },

  data() {
    return {
      foodData: undefined as UserFoodData | undefined,
    };
  },

  computed: {
    selectedFoodDescription(): string {
      const { selectedFood } = this;

      if (selectedFood.type !== 'free-text')
        throw new Error(
          'This prompt can only be displayed for foods that have not yet been encoded'
        );

      return selectedFood.description;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['replaceFood', 'getNextFoodId']),

    onFoodSelected(data: UserFoodData) {
      this.foodData = data;
      this.$emit('continue');
    },

    commitAnswer() {
      if (this.foodData === undefined) {
        console.warn('foodData is undefined');
        return;
      }

      const { selectedFood } = this;

      // Automatically select the only portion size method available to avoid triggering
      // redundant portion size option prompt
      const portionSizeMethodIndex = this.foodData.portionSizeMethods.length === 1 ? 0 : null;

      const newState: FoodState = {
        id: selectedFood.id,
        type: 'encoded-food',
        data: this.foodData,
        portionSizeMethodIndex,
        portionSize: null,
        customPromptAnswers: selectedFood?.customPromptAnswers ?? {},
        flags: selectedFood?.flags ?? [],
        linkedFoods: [],
        associatedFoodsComplete: false,
      };

      this.replaceFood({
        foodId: selectedFood.id,
        food: newState,
      });
    },
  },
});
</script>

<style scoped></style>
