import type { Ref, SetupContext } from 'vue';
import { ref } from 'vue';

import type { ComponentType } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { getOrCreatePromptStateStore, useSurvey } from '@intake24/survey/stores';

export const usePromptHandlerStore = <T extends object>(
  promptId: string,
  promptType: ComponentType,
  getInitialState: () => T,
  context: SetupContext
) => {
  const promptStore = getOrCreatePromptStateStore<T>(promptType)();
  const survey = useSurvey();

  const getFoodId = () => {
    const foodId = survey.selectedFoodOptional?.id;
    if (foodId === undefined) throw new Error('This prompt requires a food to be selected');

    return foodId;
  };

  const getMealId = () => {
    const mealId = survey.selectedMealOptional?.id;
    if (mealId === undefined) throw new Error('This prompt requires a meal to be selected');

    return mealId;
  };

  const getFoodOrMealId = promptType === 'edit-meal-prompt' ? getMealId : getFoodId;

  const storedState: T = promptStore.prompts[getFoodOrMealId()]?.[promptId];

  const state = ref(
    storedState ? merge<T>(getInitialState(), storedState) : getInitialState()
  ) as Ref<T>;

  const update = (data: { state?: T; valid?: boolean }) => {
    const { state: newState, valid } = data;
    if (newState) {
      promptStore.updateState(getFoodOrMealId(), promptId, newState);
      state.value = newState;
    }

    if (valid !== undefined) context.emit('valid', data.valid);
  };

  const clearStoredState = () => {
    promptStore.clearState(getFoodOrMealId(), promptId);
  };

  return {
    state,
    promptStore,
    getFoodId,
    getMealId,
    getFoodOrMealId,
    update,
    clearStoredState,
  };
};
