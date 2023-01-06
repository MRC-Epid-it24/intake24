import type { ComputedRef, Ref } from 'vue';
import { ref, watch } from 'vue';

export const usePromptHandlerNoStore = <T>(getInitialState: ComputedRef<T>) => {
  const state = ref(getInitialState.value) as Ref<T>;

  watch(getInitialState, (initialState) => {
    state.value = initialState;
  });

  const update = (data: { state?: T }) => {
    const { state: newState } = data;
    if (newState) state.value = newState;
  };

  return { state, update };
};
