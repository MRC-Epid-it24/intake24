import type { Ref } from 'vue';
import { ref } from 'vue';

import type { ComponentType } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { getOrCreatePromptStateStore, useSurvey } from '@intake24/survey/stores';

export const usePromptHandlerStore = <T extends object>(
  promptId: string,
  promptType: ComponentType,
  getInitialState: () => T
) => {
  const promptStore = getOrCreatePromptStateStore<T>(promptType)();
  const survey = useSurvey();

  const getFoodId = () => {
    const foodId = survey.selectedFoodOptional?.id;
    if (foodId === undefined) throw new Error('This prompt requires a food to be selected');

    return foodId;
  };

  const storedState: T = promptStore.prompts[getFoodId()]?.[promptId];

  const state = ref(
    storedState ? merge<T>(getInitialState(), storedState) : getInitialState()
  ) as Ref<T>;

  const update = (newState: T) => {
    promptStore.updateState(getFoodId(), promptId, newState);
    state.value = newState;
  };

  const clearStoredState = () => {
    promptStore.clearState(getFoodId(), promptId);
  };

  return {
    state,
    promptStore,
    getFoodId,
    update,
    clearStoredState,
  };
};