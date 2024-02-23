import type { Prompt, Prompts } from '@intake24/common/prompts';
import type { CustomPromptAnswer } from '@intake24/common/types';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils } from './use-food-prompt-utils';
import { useMealPromptUtils } from './use-meal-prompt-utils';

const infoPrompts = ['info-prompt'];

export type UseCustomPromptHandlerProps<P extends keyof Prompts> = {
  prompt: Prompts[P];
};

export const useCustomPromptHandler = <P extends keyof Prompts>(
  props: UseCustomPromptHandlerProps<P>
) => {
  const { foodOptional } = useFoodPromptUtils();
  const { mealOptional } = useMealPromptUtils();
  const survey = useSurvey();

  const isInfoPrompt = (prompt: Prompt) => infoPrompts.includes(prompt.component);

  const commitPromptAnswer = (prompt: Prompt, answer?: CustomPromptAnswer) => {
    const promptId = prompt.id;
    const isInfo = isInfoPrompt(prompt);
    const isValidAnswer = answer && (!isInfo || answer !== 'next');

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

          if (isInfo) survey.addFoodFlag(food.id, `${promptId}-acknowledged`);

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

          if (isInfo) survey.addMealFlag(meal.id, `${promptId}-acknowledged`);

          break;
        }
      }
    } else {
      if (isValidAnswer) survey.setCustomPromptAnswer({ promptId, answer });

      if (isInfo) survey.addFlag(`${promptId}-acknowledged`);
    }
  };

  return {
    commitPromptAnswer,
    foodOptional,
    mealOptional,
  };
};
