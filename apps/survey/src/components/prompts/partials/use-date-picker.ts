import { addDays } from 'date-fns';
import { computed, type SetupContext } from 'vue';

import type { Prompts } from '@intake24/common/prompts';

export type DatePickerProps = {
  prompt: Prompts['recall-date-prompt'] | Prompts['date-picker-prompt'];
  value: string | null;
};

export function useDatePicker(props: DatePickerProps, ctx: SetupContext<'input'[]>) {
  const datePickerProps = computed(() => {
    const { current, max, min } = props.prompt;
    const today = new Date();

    return {
      max: typeof max === 'number' ? addDays(today, max).toISOString().substring(0, 10) : undefined,
      min: typeof min === 'number' ? addDays(today, min).toISOString().substring(0, 10) : undefined,
      showCurrent: typeof current === 'number' ? addDays(today, current).toISOString().substring(0, 10) : true,
    };
  });

  const state = computed({
    get() {
      return props.value;
    },
    set(value) {
      ctx.emit('input', value);
    },
  });

  const isValid = computed(() => 'validation' in props.prompt ? (!props.prompt.validation.required || !!state.value) : !!state.value);

  return { datePickerProps, isValid, state };
}
