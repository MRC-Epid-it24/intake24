import type { SetupContext } from 'vue';
import { useVModel } from '@vueuse/core';

import type { PortionSizeMethodId, PortionSizeParameters } from '@intake24/common/types';

export type UserParametersProps<T extends PortionSizeMethodId> = {
  value: PortionSizeParameters[T];
};

export function useParameters<T extends PortionSizeMethodId>(props: UserParametersProps<T>, { emit }: SetupContext) {
  const parameters = useVModel(props, 'value', emit, { eventName: 'input' });

  return {
    parameters,
  };
}
