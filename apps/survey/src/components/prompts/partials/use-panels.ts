import type { ComputedRef, Ref } from 'vue';

export function usePanel<T extends Ref<{ panel: number }>>(state: T, conditions: ComputedRef<boolean[]>) {
  const closePanels = () => {
    state.value.panel = -1;
  };

  const setPanel = (value: number) => {
    state.value.panel = value;
  };

  const updatePanel = () => {
    for (const [index, condition] of Object.entries(conditions.value)) {
      if (!condition) {
        state.value.panel = Number.parseInt(index);
        return;
      }
    }

    closePanels();
  };

  return { closePanels, setPanel, updatePanel };
}
