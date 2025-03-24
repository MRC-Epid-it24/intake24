import type { SetupContext } from 'vue';
import { useVModel } from '@vueuse/core';
import type { PortionSizeMethodId, PortionSizeParameters } from '@intake24/common/surveys';

export type UserParametersProps<T extends PortionSizeMethodId> = {
  modelValue: PortionSizeParameters[T];
};

export function useParameters<T extends PortionSizeMethodId>(props: UserParametersProps<T>, { emit }: SetupContext) {
  const parameters = useVModel(props, 'modelValue', emit);

  return {
    parameters,
  };
}
