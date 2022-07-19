import { defineComponent } from '@vue/composition-api';
import { mapState } from 'pinia';
import { MealState } from '@intake24/common/types';
import { useSurvey } from '@intake24/survey/stores';

const mixin = defineComponent({
  computed: {
    ...mapState(useSurvey, ['selectedMeal', 'selectedMealIndex']),

    selectedMealRequired(): MealState {
      const selectedMeal = this.selectedMeal;

      if (selectedMeal === undefined) throw new Error('Expected a meal to be selected');

      return selectedMeal;
    },

    selectedMealIndexRequired(): number {
      const selectedMealIndex = this.selectedMealIndex;

      if (selectedMealIndex === undefined) throw new Error('Expected a meal to be selected');

      return selectedMealIndex;
    },
  },
});

export default mixin;

export type MealPromptUtilsType = InstanceType<typeof mixin>;
