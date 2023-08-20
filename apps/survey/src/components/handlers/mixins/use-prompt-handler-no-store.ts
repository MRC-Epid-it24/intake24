import type { ComputedRef, Ref, SetupContext } from 'vue';
import { ref, watch } from 'vue';

export const usePromptHandlerNoStore = <T>(
  { emit }: SetupContext<any>, // fix any - infer from component
  getInitialState: ComputedRef<T>,
  commitAnswer?: () => void
) => {
  const state = ref(getInitialState.value) as Ref<T>;

  watch(getInitialState, (initialState) => {
    state.value = initialState;
  });

  const update = (data: { state?: T }) => {
    const { state: newState } = data;
    if (newState) state.value = newState;
  };

  const action = (type: string, ...args: [id?: string, params?: object]) => {
    if (type === 'next' && commitAnswer) commitAnswer();

    emit('action', type, ...args);
  };

  return { state, action, update };
};
