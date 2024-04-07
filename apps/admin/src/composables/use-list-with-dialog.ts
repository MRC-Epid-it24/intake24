import type { Ref, SetupContext, UnwrapRef } from 'vue';
import { deepEqual } from 'fast-equals';
import { computed, ref, toRefs, watch } from 'vue';

import { copy } from '@intake24/common/util';

export type ListProps<O> = {
  value: O[];
  defaults?: O[];
};

export type ListOps<I, O = I> = {
  newItem: () => I;
  transformIn?: (item: O, index: number) => I;
  transformOut?: (item: I, index: number) => O;
};

// TODO: fix generic types casting

export function useListWithDialog<I, O>(props: ListProps<O>, context: SetupContext, ops: ListOps<I, O>) {
  const { value } = toRefs(props);
  const { newItem, transformIn, transformOut } = ops;
  const form = ref<InstanceType<typeof HTMLFormElement>>();

  const items = ref(copy(transformIn ? value.value.map(transformIn) : value.value)) as Ref<
    UnwrapRef<I>[]
  >;

  const outputItems = computed(() => (transformOut ? items.value.map(transformOut) : items.value));

  const newDialog = (show = false) => ({
    show,
    index: -1,
    item: newItem() as UnwrapRef<I>,
  });

  const dialog = ref({
    show: false,
    index: -1,
    item: newItem(),
  });

  watch(value, (val) => {
    if (deepEqual(val, outputItems.value))
      return;

    items.value = copy(transformIn ? val.map(transformIn) : val) as any;
  });

  const add = () => {
    dialog.value = newDialog(true);
  };

  const edit = (index: number, item: UnwrapRef<I>) => {
    dialog.value = { show: true, index, item: copy(item) };
  };

  const update = () => {
    context.emit('input', outputItems.value);
  };

  const load = (list: UnwrapRef<I>[]) => {
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

  const resetList = () => {
    if (!props.defaults)
      return;

    items.value = [...props.defaults] as UnwrapRef<I>[];
    update();
  };

  const save = () => {
    const isValid = form.value?.validate();
    if (!isValid)
      return;

    const { index, item } = dialog.value;

    if (index === -1)
      items.value.push(item);
    else items.value.splice(index, 1, item);

    reset();
    update();
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
    resetList,
  };
}
