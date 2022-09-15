import type { Ref, SetupContext, UnwrapRef } from 'vue';
import isEqual from 'lodash/isEqual';
import { ref, toRefs, watch } from 'vue';

import { copy } from '@intake24/common/util';

export type ListProps<T> = {
  schemeId: string;
  value: T[];
};

// TODO: fix generic types casting

export const useListWithDialog = <T>(
  props: ListProps<T>,
  context: SetupContext,
  newValue: () => T
) => {
  const { value } = toRefs(props);
  const form = ref<InstanceType<typeof HTMLFormElement>>();

  const items = ref([...value.value]) as Ref<UnwrapRef<T>[]>;

  const newDialog = (show = false) => ({
    show,
    index: -1,
    item: newValue() as UnwrapRef<T>,
  });

  const dialog = ref({
    show: false,
    index: -1,
    item: newValue(),
  });

  watch(value, (val) => {
    if (isEqual(val, items.value)) return;
    items.value = [...(val as any)];
  });

  const add = () => {
    dialog.value = newDialog(true);
  };

  const edit = (index: number, item: UnwrapRef<T>) => {
    dialog.value = { show: true, index, item: copy(item) };
  };

  const load = (list: UnwrapRef<T>[]) => {
    items.value = [...list];
    update();
  };

  const remove = (index: number) => {
    items.value.splice(index, 1);
    update();
  };

  const reset = () => {
    dialog.value = newDialog();
    form.value?.resetValidation();
  };

  const save = () => {
    const isValid = form.value?.validate();
    if (!isValid) return;

    const { index, item } = dialog.value;

    if (index === -1) items.value.push(item);
    else items.value.splice(index, 1, item);

    reset();
    update();
  };

  const update = () => {
    context.emit('input', items.value);
  };

  return {
    form,
    items,
    dialog,
    newDialog,
    add,
    edit,
    load,
    remove,
    reset,
    save,
    update,
  };
};
