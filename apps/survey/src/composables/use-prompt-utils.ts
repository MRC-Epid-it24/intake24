import { computed } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PartialRecord } from '@intake24/common/types';
import type { LocaleContentOptions } from '@intake24/i18n';
import { useI18n } from '@intake24/i18n';
import { promptType } from '@intake24/ui';

export type UsePromptProps<P extends keyof Prompts> = {
  prompt: Prompts[P];
};

export const usePromptUtils = <P extends keyof Prompts>(props: UsePromptProps<P>) => {
  const { translate } = useI18n();
  const type = computed(() => promptType(props.prompt.component));

  const translatePrompt = <T extends string>(
    keys: T[],
    params: PartialRecord<T, LocaleContentOptions['params']> = {}
  ) => {
    return keys.reduce(
      (acc, key) => {
        acc[key] = translate(props.prompt.i18n[key], {
          path: `prompts.${type.value}.${key}`,
          params: params[key] ?? {},
        });
        return acc;
      },
      {} as Record<T, string>
    );
  };

  return {
    translatePrompt,
    type,
  };
};
