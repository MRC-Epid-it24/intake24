<template>
  <food-search-prompt
    v-bind="{ localeId, promptProps }"
    v-model="searchTerm"
    @food-selected="foodSelected"
  ></food-search-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent, ref } from 'vue';

import type { FoodSearchPromptProps } from '@intake24/common/prompts';
import type { FoodState } from '@intake24/common/types';
import type { UserFoodData } from '@intake24/common/types/http';
import {
  promptHandlerStateless,
  useFoodPromptUtils,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import FoodSearchPrompt from '@intake24/survey/components/prompts/standard/FoodSearchPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'FoodSearchPromptHandler',

  components: { FoodSearchPrompt },

  mixins: [promptHandlerStateless],

  props: {
    promptProps: {
      type: Object as PropType<FoodSearchPromptProps>,
      required: true,
    },
  },

  setup() {
    const { freeTextSelectedFood, localeId } = useFoodPromptUtils();

    const foodData = ref<UserFoodData | undefined>(undefined);
    const searchTerm = ref(freeTextSelectedFood().description);

    return { foodData, searchTerm, freeTextSelectedFood, localeId };
  },

  computed: {
    selectedFoodDescription(): string {
      return this.freeTextSelectedFood().description;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['replaceFood', 'getNextFoodId']),

    isValid(): boolean {
      return false; // Continue button should always be disabled for this prompt
    },

    foodSelected(foodData: UserFoodData) {
      this.foodData = foodData;
      this.$emit('continue');
    },

    commitAnswer() {
      const { foodData, searchTerm } = this;
      if (foodData === undefined) {
        console.warn('FoodSearchPromptHandler: foodData is undefined.');
        return;
      }

      const { id, customPromptAnswers, flags } = this.freeTextSelectedFood();

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
