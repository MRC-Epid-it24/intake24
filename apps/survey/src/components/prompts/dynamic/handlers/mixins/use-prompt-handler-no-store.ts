import type { Ref, SetupContext } from 'vue';
import { ref } from 'vue';

export const usePromptHandlerNoStore = <T extends object>(
  getInitialState: () => T,
  context: SetupContext
) => {
  const state = ref(getInitialState()) as Ref<T>;

  const update = (data: { state?: T; valid?: boolean }) => {
    const { state: newState, valid } = data;
    if (newState) state.value = newState;

    if (valid !== undefined) context.emit('valid', data.valid);
  };

  return {
    state,
    update,
  };
};
