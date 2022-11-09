import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import { useSurvey } from '@intake24/survey/stores';

export function requireMeal(meal: MealState | undefined): MealState {
  if (meal === undefined) throw new Error('Expected a meal to be selected');
  return meal;
}

const component = defineComponent({
  computed: {
    ...mapState(useSurvey, ['selectedMealOptional']),

    selectedMeal(): MealState {
      return requireMeal(this.selectedMealOptional);
    },
  },
});

export default component;
