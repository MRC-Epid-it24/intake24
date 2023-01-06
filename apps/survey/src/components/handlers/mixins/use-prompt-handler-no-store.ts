import type { ComputedRef, Ref, SetupContext } from 'vue';
import { ref, watch } from 'vue';

export const usePromptHandlerNoStore = <T>(
  getInitialState: ComputedRef<T>,
  context: SetupContext
) => {
  const state = ref(getInitialState.value) as Ref<T>;

  watch(getInitialState, (initialState) => {
    state.value = initialState;
  });

  const update = (data: { state?: T; valid?: boolean }) => {
    const { state: newState, valid } = data;
    if (newState) state.value = newState;

    if (valid !== undefined) context.emit('valid', data.valid);
  };

  return { state, update };
};
