import type { Ref } from 'vue';
import { ref } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { getOrCreatePromptStateStore, useSurvey } from '@intake24/survey/stores';

export const usePromptHandlerStore = <P extends keyof PromptStates, S extends PromptStates[P]>(
  promptId: string,
  promptType: P,
  getInitialState: () => S
) => {
  const promptStore = getOrCreatePromptStateStore<S>(promptType)();
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

  const storedState: S | undefined = promptStore.prompts[getFoodOrMealId()]?.[promptId];

  const state = ref(
    storedState ? merge<S>(getInitialState(), storedState) : getInitialState()
  ) as Ref<S>;

  const update = (data: { state?: S }) => {
    const { state: newState } = data;
    if (newState) {
      promptStore.updateState(getFoodOrMealId(), promptId, newState);
      state.value = newState;
    }
  };

  const clearStoredState = () => {
    promptStore.clearState(getFoodOrMealId(), promptId);
  };

  const commitPortionSize = () => {
    if (!('portionSize' in state.value))
      throw new Error('This prompt does not support portion size method');

    const { portionSize } = state.value;
    const foodId = getFoodId();

    survey.updateFood({ foodId, update: { portionSize } });
    survey.addFoodFlag({ foodId, flag: 'portion-size-method-complete' });
  };

  return {
    state,
    promptStore,
    getFoodId,
    getMealId,
    getFoodOrMealId,
    update,
    clearStoredState,
    commitPortionSize,
  };
};
