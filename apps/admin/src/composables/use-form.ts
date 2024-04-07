import pick from 'lodash/pick';
import { computed, reactive } from 'vue';

import type { FormConfig } from '@intake24/admin/util';
import { createForm } from '@intake24/admin/util';

export type UseFormProps<F> = {
  data: F;
  config?: FormConfig;
  loadCallback?: (data: any) => any;
  nonInputErrorKeys?: string[];
};

export function useForm<F extends object>(formProps: UseFormProps<F>) {
  const { data, config, loadCallback, nonInputErrorKeys = [] } = formProps;

  const form = reactive(createForm<F>(data, config));

  const nonInputErrors = computed(() => Object.values(pick(form.errors.all(), nonInputErrorKeys)));

  const toForm = (data: any) => {
    const input = loadCallback ? loadCallback(data) : data;

    form.load(input);
  };

  const clearError = (event: KeyboardEvent) => {
    const { name } = event.target as HTMLInputElement;

    if (name)
      form.errors.clear(name);
  };

  return {
    form,
    nonInputErrorKeys,
    nonInputErrors,
    toForm,
    clearError,
  };
}
