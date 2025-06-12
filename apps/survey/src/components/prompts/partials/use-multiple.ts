import type { Replace } from 'type-fest';
import { computed } from 'vue';
import type { HasMultiple, Prompt } from '@intake24/common/prompts';
import type { EncodedFood } from '@intake24/common/surveys';
import { usePortionSizeMethod } from './use-portion-size-method';

export type UseMultipleProps = {
  food: EncodedFood;
  prompt: Prompt & HasMultiple;
};

export function useMultiple<P extends 'as-served-prompt'>(props: UseMultipleProps) {
  const { parameters } = usePortionSizeMethod<Replace<P, '-prompt', ''>>(props);

  const multipleProps = computed(() => {
    if (typeof props.prompt.multiple === 'boolean')
      return undefined;

    const { type, ...rest } = props.prompt.multiple;

    return rest;
  });
  const multipleEnabled = computed(() => {
    if (typeof props.prompt.multiple === 'boolean')
      return props.prompt.multiple;

    if (typeof props.prompt.multiple.strategy === 'boolean')
      return props.prompt.multiple.strategy;

    return !!parameters.value.multiple;
  });

  return { multipleProps, multipleEnabled };
}
