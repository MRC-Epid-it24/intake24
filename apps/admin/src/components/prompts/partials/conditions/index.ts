import BooleanPropertyCheck from './boolean-check.vue';
import FlagPropertyCheck from './flag-check.vue';
import FoodCompletionPropertyCheck from './food-completion-check.vue';
import MealCompletionPropertyCheck from './meal-completion-check.vue';
import PromptAnswerPropertyCheck from './prompt-answer-check.vue';
import Summary from './summary.vue';
import TagPropertyCheck from './tag-check.vue';
import ValuePropertyCheck from './value-check.vue';

export default {
  check: {
    value: ValuePropertyCheck,
    boolean: BooleanPropertyCheck,
    mealCompletion: MealCompletionPropertyCheck,
    foodCompletion: FoodCompletionPropertyCheck,
    flag: FlagPropertyCheck,
    tag: TagPropertyCheck,
    promptAnswer: PromptAnswerPropertyCheck,
  },
  summary: Summary,
};
