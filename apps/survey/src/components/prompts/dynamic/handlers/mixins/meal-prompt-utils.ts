import { mapState } from 'pinia';
import type { MealState } from '@intake24/common/types';
import { useSurvey } from '@intake24/survey/stores';
import { defineComponent } from 'vue';

// export default (Vue as VueConstructor<Vue & MealPromptUtilsType>).extend({
const component = defineComponent({
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

export default component;

export type MealPromptUtilsType = InstanceType<typeof component>;
