import { computed } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import { promptType } from '@intake24/ui/util';

export type UsePromptProps<P extends keyof Prompts> = {
  prompt: Prompts[P];
};

export const usePromptUtils = <P extends keyof Prompts>(props: UsePromptProps<P>) => {
  const type = computed(() => promptType(props.prompt.component));

  return {
    type,
  };
};
