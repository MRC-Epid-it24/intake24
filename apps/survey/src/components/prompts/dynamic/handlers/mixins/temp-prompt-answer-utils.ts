import { defineComponent } from '@vue/composition-api';
import { mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import { PromptAnswer } from '@intake24/common/types';

type PromptType = 'food' | 'meal';

export default defineComponent({
  computed: {
    ...mapState(useSurvey, ['currentTempPromptAnswer', 'selectedMealIndex', 'selectedFoodIndex']),
  },
  methods: {
    promptTempAnswerIdentification(data: {
      promptAnswer: PromptAnswer;
      type: PromptType;
    }): boolean {
      if (data.type === 'meal')
        return (
          data.promptAnswer &&
          data.promptAnswer.prompt === this.promptComponent &&
          data.promptAnswer.mealIndex === this.selectedMealIndex &&
          data.promptAnswer.response !== null
        );
      return (
        data.promptAnswer &&
        data.promptAnswer.prompt === this.promptComponent &&
        data.promptAnswer.mealIndex === this.selectedMealIndex &&
        data.promptAnswer.foodIndex === this.selectedFoodIndex &&
        data.promptAnswer.response !== null
      );
    },
  },
});
