<template>
  <food-search-prompt
    :prompt-props="promptProps"
    :initial-search-term="selectedFoodDescription"
    @food-selected="onFoodSelected"
  ></food-search-prompt>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { mapGetters } from 'vuex';
import { FoodSearchPromptProps } from '@intake24/common/prompts';
import { FoodState } from '@intake24/common/types';
import { UserFoodData } from '@intake24/common/types/http';
import FoodSearchPrompt from '@intake24/survey/components/prompts/standard/FoodSearchPrompt.vue';

export default defineComponent({
  name: 'FoodSearchPromptHandler',

  components: { FoodSearchPrompt },

  props: {
    promptProps: {
      type: Object as PropType<FoodSearchPromptProps>,
      required: true,
    },
  },

  computed: {
    ...mapGetters('survey', ['selectedFood', 'selectedMealIndex', 'selectedFoodIndex']),

    selectedFoodDescription(): string {
      const { selectedFood } = this;

      if (selectedFood === undefined) throw new Error('This prompt requires a food to be selected');

      if (selectedFood.type !== 'free-text')
        throw new Error(
          'This prompt can only be displayed for foods that have not yet been encoded'
        );

      return selectedFood.description;
    },
  },

  methods: {
    onFoodSelected(data: UserFoodData) {
      const currentState: FoodState | undefined = this.$store.getters['survey/selectedFood'];

      // Automatically select the only portion size method available to avoid triggering
      // redundant portion size option prompt
      const portionSizeMethodIndex = data.portionSizeMethods.length === 1 ? 0 : null;

      const newState: FoodState = {
        type: 'encoded-food',
        data,
        portionSizeMethodIndex,
        portionSize: null,
        customPromptAnswers: currentState?.customPromptAnswers ?? {},
        flags: currentState?.flags ?? [],
      };

      this.$store.commit('survey/replaceFood', {
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        food: newState,
      });

      this.$emit('complete');
    },
  },
});
</script>

<style scoped></style>
