import BooleanPropertyCheck from './boolean-check.vue';
import FlagPropertyCheck from './flag-check.vue';
import MealCompletionPropertyCheck from './meal-completion-check.vue';
import PromptAnswerPropertyCheck from './prompt-answer-check.vue';
import Summary from './summary.vue';
import ValuePropertyCheck from './value-check.vue';

export default {
  check: {
    value: ValuePropertyCheck,
    boolean: BooleanPropertyCheck,
    mealCompletion: MealCompletionPropertyCheck,
    flag: FlagPropertyCheck,
    promptAnswer: PromptAnswerPropertyCheck,
  },
  summary: Summary,
};
