import type { Prompt, Prompts } from '@intake24/common/prompts';
import type { CustomPromptAnswer, PromptSection } from '@intake24/common/surveys';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils } from './use-food-prompt-utils';
import { useMealPromptUtils } from './use-meal-prompt-utils';

const infoPrompts = ['info-prompt'];

export type UseCustomPromptHandlerProps<P extends keyof Prompts> = {
  prompt: Prompts[P];
  section: PromptSection;
};

export function useCustomPromptHandler<P extends keyof Prompts>(props: UseCustomPromptHandlerProps<P>) {
  const { foodOptional } = useFoodPromptUtils();
  const { mealOptional } = useMealPromptUtils();
  const survey = useSurvey();

  const isAnswerRequired = (prompt: Prompt) =>
    !('validation' in prompt) || prompt.validation.required;
  const isInfoPrompt = (prompt: Prompt) => infoPrompts.includes(prompt.component);

  const getPromptAnswer = (id: string) => {
    if (foodOptional.value && ['foods'].includes(props.section))
      return foodOptional.value.customPromptAnswers[id];

    if (mealOptional.value && ['preFoods', 'postFoods'].includes(props.section))
      return mealOptional.value.customPromptAnswers[id];

    return survey.data.customPromptAnswers[id];
  };

  const commitPromptAnswer = (prompt: Prompt, promptAnswer?: CustomPromptAnswer) => {
    const promptId = prompt.id;
    const isInfo = isInfoPrompt(prompt);

    if (promptAnswer === undefined && isAnswerRequired(props.prompt)) {
      console.warn('Did not expect answer to be undefined', props.prompt);
      return;
    }

    const answer = promptAnswer ?? null;
    const isValidAnswer = answer !== undefined && (!isInfo || answer !== 'next');

    if (survey.selection.element) {
      switch (survey.selection.element.type) {
        case 'food': {
          const food = foodOptional.value;
          if (!food) {
            console.warn('Expected meal to be defined');
            return;
          }

          if (isValidAnswer)
            survey.setFoodCustomPromptAnswer({ foodId: food.id, promptId, answer });

          if (isInfo)
            survey.addFoodFlag(food.id, `${promptId}-acknowledged`);

          break;
        }
        case 'meal': {
          const meal = mealOptional.value;
          if (!meal) {
            console.warn('Expected meal to be defined');
            return;
          }

          if (isValidAnswer)
            survey.setMealCustomPromptAnswer({ mealId: meal.id, promptId, answer });

          if (isInfo)
            survey.addMealFlag(meal.id, `${promptId}-acknowledged`);

          break;
        }
      }
    }
    else {
      if (isValidAnswer)
        survey.setCustomPromptAnswer({ promptId, answer });

      if (isInfo)
        survey.addFlag(`${promptId}-acknowledged`);
    }
  };

  return {
    commitPromptAnswer,
    getPromptAnswer,
    foodOptional,
    isAnswerRequired,
    mealOptional,
  };
}
