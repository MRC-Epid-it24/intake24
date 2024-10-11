import { addDays } from 'date-fns';
import { computed, type SetupContext } from 'vue';
import { useDate } from 'vuetify';

import type { Prompts } from '@intake24/common/prompts';

export type DatePickerProps = {
  prompt: Prompts['recall-date-prompt'] | Prompts['date-picker-prompt'];
  modelValue: string | null;
};

export function useDatePicker(props: DatePickerProps, ctx: SetupContext<'update:modelValue'[]>) {
  const adapter = useDate();

  const datePickerProps = computed(() => {
    const { current, max, min } = props.prompt;
    const today = adapter.parseISO(new Date().toISOString().substring(0, 10)) as Date;

    return {
      max: typeof max === 'number' ? addDays(today, max) : undefined,
      min: typeof min === 'number' ? addDays(today, min) : undefined,
      showCurrent: typeof current === 'number' ? addDays(today, current) : true,
    };
  });

  const state = computed({
    get() {
      return props.modelValue ? adapter.parseISO(new Date(props.modelValue).toISOString().substring(0, 10)) : null;
    },
    set(value) {
      ctx.emit('update:modelValue', value ? adapter.toISO(value).substring(0, 10) : null);
    },
  });

  const isValid = computed(() => 'validation' in props.prompt ? (!props.prompt.validation.required || !!state.value) : !!state.value);

  return { datePickerProps, isValid, state };
}
